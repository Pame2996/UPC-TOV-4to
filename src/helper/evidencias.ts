import fs from "fs";
import path from "path";
import { Page } from "@playwright/test";

// Evidencias por documento: evidencias/<DNI>/<DNI>_<Pantalla>.png
// El DNI sale de TEST_DNI. Si la misma pantalla se repite, se agrega _2, _3...
export function documentoActual(): string {
    return (process.env.TEST_DNI || "sin-documento").trim();
}

function limpiar(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}

export function pantallaDesdeUrl(url: string): string {
    try {
        const ruta = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
        return ruta ? limpiar(ruta) : "inicio";
    } catch {
        return "pantalla";
    }
}

export async function guardarEvidencia(page: Page, pantalla: string): Promise<Buffer> {
    const dni = documentoActual();
    const prefijo = process.env.EVIDENCIA_PREFIJO || "";
    const carpeta = path.join(process.cwd(), "evidencias", `${prefijo}${dni}`);
    fs.mkdirSync(carpeta, { recursive: true });
    const base = `${dni}_${limpiar(pantalla) || "pantalla"}`;
    let archivo = path.join(carpeta, `${base}.png`);
    let n = 2;
    while (fs.existsSync(archivo)) {
        archivo = path.join(carpeta, `${base}_${n}.png`);
        n++;
    }
    return await page.screenshot({ path: archivo, fullPage: true, type: "png" });
}
