import fs from "fs";
import path from "path";
import { Page } from "@playwright/test";

// Evidencias de ejecución:
//   evidencias/<ambiente>_<documento>_<flujo>_<grado>/<ambiente>_<documento>_<flujo>_<grado>_<pantalla>.png
// - ambiente: cert | dev | prod (TEST_ENV)
// - documento: el de la ejecución (TEST_DNI, o el del Examples en login)
// - flujo: sale del feature que se ejecuta (login, registro, registromastov, registropretov, fichafisica)
// - grado: 4to | 5to | egresado
// - pantalla: sale de la URL; si la misma pantalla se captura otra vez se numera (_2, _3...)
// Las capturas tomadas antes de conocer las cuatro partes se guardan al completarse el nombre.

const RAIZ = "evidencias";

export function limpiarNombre(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9_-]+/g, "_")
        .replace(/^_+|_+$/g, "") || "sin_nombre";
}

export function pantallaDesdeUrl(url: string): string {
    const partes = new URL(url).pathname.split("/").filter(Boolean);
    return partes.length ? limpiarNombre(partes.join("-")) : "inicio";
}

// "login.feature" -> "login"; "registrate.feature" -> "registro"; el resto, el nombre del feature en minúsculas
export function flujoDesdeUri(uri: string): string {
    const nombre = path.basename(uri, ".feature").toLowerCase();
    return nombre === "registrate" ? "registro" : nombre;
}

// "Grado 10 o 4to de secundaria" -> "4to"; "Grado 11 o 5to de secundaria" -> "5to"; "Ya terminé el colegio" -> "egresado"
export function gradoCorto(grado: string): string {
    const texto = grado.toLowerCase();
    if (texto.includes("4to") || texto.includes("cuarto")) return "4to";
    if (texto.includes("5to") || texto.includes("quinto")) return "5to";
    if (texto.includes("termin") || texto.includes("egres")) return "egresado";
    return limpiarNombre(grado);
}

// Se ejecuta dentro de la página: quita el recorte de los contenedores con scroll propio (y de sus
// contenedores padre) para que el contenido completo entre en la captura. NO cambia el tamaño de la
// ventana, así que los elementos responsivos (vh, media queries) se ven igual que durante la prueba.
// Deja guardada en window una función para volver todo a como estaba.
function expandirContenedores(): number {
    const conScroll = Array.from(document.querySelectorAll<HTMLElement>("*")).filter((el) => {
        const overflowY = getComputedStyle(el).overflowY;
        return (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1;
    });
    const tocados = new Set<HTMLElement>();
    conScroll.forEach((el) => {
        let nodo: HTMLElement | null = el;
        while (nodo && nodo !== document.documentElement) {
            tocados.add(nodo);
            nodo = nodo.parentElement;
        }
    });
    const originales: { el: HTMLElement; estilo: string | null }[] = [];
    tocados.forEach((el) => {
        originales.push({ el, estilo: el.getAttribute("style") });
        if (getComputedStyle(el).overflowY !== "visible") el.style.setProperty("overflow", "visible", "important");
        el.style.setProperty("height", "auto", "important");
        el.style.setProperty("max-height", "none", "important");
    });
    (window as any).__restaurarEvidencia = () => {
        originales.forEach(({ el, estilo }) => (estilo === null ? el.removeAttribute("style") : el.setAttribute("style", estilo)));
        delete (window as any).__restaurarEvidencia;
    };
    return conScroll.length;
}

// Se ejecuta dentro de la página: espera imágenes y fuentes (máx. 5 s) para no capturar a medio cargar
function esperarRecursos(): Promise<unknown> {
    const imagenes = Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolver) => { img.onload = img.onerror = resolver; }));
    const fuentes = document.fonts ? document.fonts.ready : Promise.resolve();
    return Promise.race([
        Promise.all([...imagenes, fuentes]),
        new Promise((resolver) => setTimeout(resolver, 5000)),
    ]);
}

// Captura la pantalla completa: espera la carga, expande los contenedores con scroll propio (que
// fullPage no cubre) sin cambiar el tamaño de la ventana, captura y los deja como estaban.
// EVIDENCIA_MODO=normal desactiva la expansión y usa solo fullPage.
export async function capturarPantallaCompleta(page: Page): Promise<Buffer> {
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
    await page.evaluate(esperarRecursos).catch(() => {});

    const expandir = process.env.EVIDENCIA_MODO !== "normal";
    const expandidos = expandir ? await page.evaluate(expandirContenedores).catch(() => 0) : 0;
    try {
        if (expandidos > 0) {
            // Dos cuadros de animación para que el navegador termine de acomodar el contenido expandido
            await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))).catch(() => {});
        }
        return await page.screenshot({ type: "png", fullPage: true });
    } finally {
        if (expandidos > 0) {
            await page.evaluate(() => (window as any).__restaurarEvidencia?.()).catch(() => {});
        }
    }
}

export type ParteNombre = "ambiente" | "documento" | "flujo" | "grado";
const PARTES: ParteNombre[] = ["ambiente", "documento", "flujo", "grado"];

export class Evidencias {
    private readonly partes: Partial<Record<ParteNombre, string>> = {};
    private pendientes: { pantalla: string; imagen: Buffer }[] = [];
    private readonly usos = new Map<string, number>();

    // Registra una parte del nombre; cuando ya están las cuatro, guarda lo capturado hasta ese momento
    fijar(parte: ParteNombre, valor: string) {
        this.partes[parte] = limpiarNombre(valor);
        if (this.completo()) this.vaciarPendientes();
    }

    // ambiente_documento_flujo_grado (con "sin-<parte>" si alguna no llegó a conocerse)
    get nombreBase(): string {
        return PARTES.map((p) => this.partes[p] ?? `sin-${p}`).join("_");
    }

    // Ruta de un archivo de evidencia de la ejecución actual (crea la carpeta)
    rutaArchivo(nombre: string): string {
        const base = this.nombreBase;
        const carpeta = path.join(RAIZ, base);
        fs.mkdirSync(carpeta, { recursive: true });
        return path.join(carpeta, `${base}_${limpiarNombre(nombre)}.png`);
    }

    async capturar(page: Page, pantalla: string = pantallaDesdeUrl(page.url())): Promise<Buffer> {
        const imagen = await capturarPantallaCompleta(page);
        if (this.completo()) this.guardar(pantalla, imagen);
        else this.pendientes.push({ pantalla, imagen });
        return imagen;
    }

    // Al terminar el escenario: lo que quedó pendiente se guarda con "sin-<parte>" para no perderlo
    cerrar() {
        this.vaciarPendientes();
    }

    private completo(): boolean {
        return PARTES.every((p) => this.partes[p] !== undefined);
    }

    private vaciarPendientes() {
        const pendientes = this.pendientes;
        this.pendientes = [];
        pendientes.forEach((p) => this.guardar(p.pantalla, p.imagen));
    }

    private guardar(pantalla: string, imagen: Buffer) {
        const veces = (this.usos.get(pantalla) ?? 0) + 1;
        this.usos.set(pantalla, veces);
        fs.writeFileSync(this.rutaArchivo(veces === 1 ? pantalla : `${pantalla}_${veces}`), imagen);
    }
}
