import {Page,Locator, FrameLocator} from "playwright/test";
import BasePage from './basePage';
import {Registrate} from './registratePage';
import { expect } from "@playwright/test";
import {PREGUNTAS_PERSONALIDAD} from "../utils/dataPreguntas";
import path from "path";
import { leerPreguntasConOpcion } from "../utils/leerExcel";

export class RealizaTOVBigFive extends BasePage{
    private readonly registratePage: Registrate;
    readonly page:Page;
    readonly opciones: Locator;
    readonly autoconocimiento: Locator;
    readonly personalidadTittle: Locator;
    readonly continuarModal: Locator;

    constructor(page:Page){
        super(page)
        this.page=page;
        this.registratePage = new Registrate(page);
        this.personalidadTittle = page.locator("p", { hasText: "Lee cada situación y marca cuánto se parece a ti en tu vida diaria" });
        this.opciones = this.page.getByRole('button');
        this.autoconocimiento = page.getByRole("button", { name: "¡Comenzar el test!" });
        this.continuarModal= page.getByRole('button', { name: 'Continuar', exact: true });
        PREGUNTAS_PERSONALIDAD.map(p => this.normalizarTexto(p));
    }

    async iniciarTest(){
        await this.waitForElementVisible(this.autoconocimiento);
        await this.clickElement(this.autoconocimiento);
    }

    async visualizarPersonalidad(){
        await this.waitForElementVisible(this.personalidadTittle);
    }

    async responderPersonalidad(dni:string){
        const filePath = path.resolve(process.cwd(), "src/tests/data/Carreras_1.xlsx");
        const filasExcel = leerPreguntasConOpcion({
            filePath,
            sheetName: "BigFive",
            colIDPregunta: "IDPregunta",
            colPregunta: "Pregunta",
            colOpcion: "Opcion",
        });
        const excelMap = new Map<string, { opcionUI: string }>();
        for (const fila of filasExcel) {
            const textoOpcion =
                fila.opcion === "0" ? "Para nada" :
                fila.opcion === "1" ? "No mucho" :
                fila.opcion === "2" ? "Más o menos" :
                fila.opcion === "3" ? "Sí, un poco" :
                fila.opcion === "4" ? "Sí, totalmente" :   
                fila.opcion;
            
            excelMap.set(this.normalizarTexto(fila.pregunta), { opcionUI: textoOpcion });
        }
        let textoAnterior = ""; // Fuera del bucle

        for(let i = 1; i <= 25; i++) {
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
                console.log(preguntaNorm, "|", match.opcionUI);
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
            if(i===25){
                console.log("ENTRÉ AL i=25");
                await this.waitForElementVisible(this.continuarModal);
                this.clickElement(this.continuarModal);
            }
        }
        
}
}