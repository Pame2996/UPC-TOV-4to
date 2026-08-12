import {Page,Locator, FrameLocator} from "playwright/test";
import BasePage from './basePage';
import {Login} from './loginPage';
import { expect } from "@playwright/test";
import path from "path";
import { leerPreguntasConOpcion } from "../utils/leerExcel";
import { getTestDataFile } from "../utils/config";

export class RealizaTOVVocare extends BasePage{
    private readonly loginPage: Login;
    readonly page:Page;
    readonly opciones: Locator;
    readonly habilidadesTittle: Locator;

    constructor(page:Page){
        super(page)
        this.page=page;
        this.loginPage = new Login(page);
        this.opciones = this.page.getByRole('button');
        this.habilidadesTittle = page.locator("h2", { hasText: "Considero que..." });
    }

    async visualizarHabilidades(){
        await this.waitForElementVisible(this.habilidadesTittle);
    }

    async responderHabilidades(dni:string){
        await this.page.waitForTimeout(2000);
        const filePath = path.resolve(process.cwd(), "src/tests/data", getTestDataFile());
        const filasExcel = leerPreguntasConOpcion({
            filePath,
            sheetName: "Vocare",
            colIDPregunta: "IDPregunta",
            colPregunta: "Pregunta",
            colOpcion: "Opcion",
        });

        const excelMap = new Map<string, { opcionUI: string }>();

        for (const fila of filasExcel) {
            const textoOpcion =
            fila.opcion === "N" ? "No me interesa" :
            fila.opcion === "T" ? "No estoy seguro/a" :
            fila.opcion === "S" ? "Sí, me interesa" :
            fila.opcion;

            excelMap.set(this.normalizarTexto(fila.pregunta), { opcionUI: textoOpcion });
        }
        let textoAnterior = ""; // Fuera del bucle

        for(let i = 1; i <= 43; i++) {
            const pregunta = this.page.locator('p.font-bold.text-2xl');

            if (i > 1) {
                // Asegura que la pregunta sea distinta a la que procesamos en la vuelta anterior
                // (polling desde Node en vez de page.waitForFunction: el sitio bloquea eval en la página vía CSP)
                const limite = Date.now() + 15000;
                let cambio = false;
                while (Date.now() < limite) {
                    if ((await pregunta.textContent()) !== textoAnterior) {
                        cambio = true;
                        break;
                    }
                    await this.page.waitForTimeout(200);
                }
                if (!cambio) {
                    throw new Error(`Timeout esperando que cambie la pregunta (anterior: "${textoAnterior}")`);
                }
            }

            const texto = await pregunta.innerText();
            // ¡CRÍTICO!: Actualiza el textoAnterior justo después de leer la pregunta nueva
            textoAnterior = texto; 

            const preguntaNorm = this.normalizarTexto(texto);
            const match = excelMap.get(preguntaNorm);

            if (!match) {
                throw new Error(`Pregunta no encontrada: "${texto}"`);
            }
            // Filtra el botón asegurando que sea el que contiene la opción exacta y está dentro del área visible
            const labelASeleccionar = this.page.getByRole('button', { name: match.opcionUI });

            try {
                console.log(preguntaNorm," | ", match.opcionUI);
                await expect(labelASeleccionar).toBeVisible();
                await labelASeleccionar.click(); // Intenta usar el click directo antes de tu clickElement
                // Espera a que la selección se refleje (ej: el botón cambia de color)
                // Esto ayuda a que el DOM se "estabilice" antes de la siguiente vuelta
                await this.page.waitForTimeout(1000); 
            } catch (error: any) {
                // Corrección del log para que muestre el índice i actual
                console.error(`❌ Error en pregunta ${i}:`, error.message);
                await this.page.screenshot({ path: `./test-result/screenshots/ERROR_P${i}.png` });
            }
        }
}
}