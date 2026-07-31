import {Page,Locator, FrameLocator} from "playwright/test";
import BasePage from './basePage';
import {Login} from './loginPage';
import { expect } from "@playwright/test";
import path from "path";
import { leerPreguntasConOpcion } from "../utils/leerExcel";

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
        const filePath = path.resolve(process.cwd(), "src/tests/data/Carreras_1.xlsx");
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
                await this.page.waitForFunction(
                    (prevText) => document.querySelector('p.font-bold.text-2xl')?.textContent !== prevText,
                    textoAnterior,
                    { timeout: 15000 }
                );
            }

            const texto = await pregunta.innerText();
            // ¡CRÍTICO!: Actualiza el textoAnterior justo después de leer la pregunta nueva
            textoAnterior = texto; 

            const preguntaNorm = this.normalizarTexto(texto);
            const match = excelMap.get(preguntaNorm);

            if (!match) {
                throw new Error(`Pregunta no encontrada: "${texto}"`);
            }
            await this.page.screenshot({path: `screenshots/${dni}/Vocare/PreguntaAntes-${i}.png`,fullPage: true});
            // Filtra el botón asegurando que sea el que contiene la opción exacta y está dentro del área visible
            const labelASeleccionar = this.page.getByRole('button', { name: match.opcionUI });

            try {
                console.log(preguntaNorm," | ", match.opcionUI);
                await expect(labelASeleccionar).toBeVisible();
                await labelASeleccionar.click(); // Intenta usar el click directo antes de tu clickElement
                await this.page.screenshot({path: `screenshots/${dni}/Vocare/PreguntaDespues-${i}.png`,fullPage: true});
                
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