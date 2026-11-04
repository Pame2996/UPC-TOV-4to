import {Page,Locator, FrameLocator} from "playwright/test";
import BasePage from './basePage';
import { expect } from "@playwright/test";
import path from "path";
import { leerCarreras } from "../utils/leerExcel";
import { getTestDataFile } from "../utils/config";

export class ValidaCarreras extends BasePage{
    readonly page:Page;
    readonly resultadosTittle1: Locator;
    readonly resultadosTittle2: Locator;
    readonly resultadosTittle3: Locator;
    readonly resultadosTittle4: Locator;
    readonly siguienteButton: Locator;
    readonly continuarButton: Locator;
    readonly resultadosTittle5: Locator;
    readonly saberButton: Locator;
    readonly importanteButton: Locator;
    readonly carrerasTittle: Locator;
    readonly saberMasButton: Locator;
    readonly asesoria: Locator;
    readonly opcionAsesoriaSi:Locator;

    constructor(page:Page){
        super(page)
        this.page=page;
        this.resultadosTittle1 = page.locator("h2", { hasText: "PERSONALIDAD" });
        this.resultadosTittle2 = page.locator("h2", { hasText: "FORTALEZA" });
        this.resultadosTittle3 = page.locator("h2", { hasText: "DESAFÍOS" });
        this.resultadosTittle4 = page.locator("h2", { hasText: "DONDE BRILLARÁS" });
        this.siguienteButton = page.locator('button.carousel-button.right:visible').first();
        this.continuarButton = page.getByRole("button",{name:"Quiero saber más"});
        this.resultadosTittle5 = page.locator("h1", { hasText: "Conoce las carreras más compatibles contigo" });
        this.saberButton = page.getByRole("button",{name:"Quiero saber mis resultados"});
        this.importanteButton = page.getByRole('button', { name: 'Entendido', exact: true });
        this.carrerasTittle = page.locator("h1", { hasText: "Estas son las carreras más compatibles contigo" });
        this.saberMasButton = page.getByRole('button', { name: 'Quiero saber más', exact: true });
        this.asesoria = page.locator("h3", { hasText: "¿TE GUSTARÍA RECIBIR UNA ASESORÍA VOCACIONAL GRATUITA?" });
        this.opcionAsesoriaSi = this.page.locator('label').filter({ hasText: '¡Sí! Quiero recibir asesoría' }).first();
    }

    // Títulos de las carreras compatibles que muestra el resultado del TOV (espera a que carguen las tarjetas)
    async obtenerCarrerasCompatibles(): Promise<string[]> {
        await this.page.locator('li.carousel-item h2').first().waitFor({ state: 'visible', timeout: 15000 });
        const titulos = await this.page.locator('li.carousel-item h2').allTextContents();
        return titulos.map(t => t.trim());
    }

    async visualizarResultados(grado:string){
        if(grado=="1"){
            await this.waitForElementVisible(this.resultadosTittle1);
            await this.siguienteButton.click();
            await this.waitForElementVisible(this.resultadosTittle2);
            await this.siguienteButton.click();
            await this.waitForElementVisible(this.resultadosTittle3);
            await this.siguienteButton.click();
            await this.waitForElementVisible(this.resultadosTittle4);
            await this.clickElement(this.continuarButton);
            await this.waitForElementVisible(this.resultadosTittle5);
            await this.clickElement(this.saberButton);
            await this.waitForElementVisible(this.importanteButton);
            await this.clickElement(this.importanteButton);
        }
        else {
           await this.waitForElementVisible(this.resultadosTittle5);
            await this.clickElement(this.saberButton);
            await this.waitForElementVisible(this.importanteButton);
            await this.clickElement(this.importanteButton); 
        }
    }

    // rutaCaptura(n, titulo): ruta donde guardar la captura de cada tarjeta (la define quien llama)
    async verCarreras(rutaCaptura: (n: number, titulo: string) => string){
        console.log("🚀 Validando carreras...");

        await this.waitForElementVisible(this.carrerasTittle);
        await this.page.waitForSelector('li.carousel-item h2', { timeout: 10000 });

        const carrerasExcel = leerCarreras({
            filePath: path.join("src/tests/data", getTestDataFile()),
            sheetName: "Carreras",
            colTitulo: "Titulo",
        });

        const titulosExcel = carrerasExcel.map(c =>
            c.titulo.trim().toLowerCase()
        );

        const titulosUI = (await this.obtenerCarrerasCompatibles()).map(t => t.toLowerCase());

        console.log("🖥️ UI:", titulosUI);
        console.log("📄 Excel:", titulosExcel);

        expect([...titulosUI].sort()).toEqual([...titulosExcel].sort());

        console.log("✅ Carreras validadas correctamente");
        /*******************************************************************/
        
        // --- LÓGICA DE INTERACCIÓN AGREGADA ---
        const cards = this.page.locator('li.carousel-item:has(h2)');
        const totalCards = await cards.count();

        
        for (let i = 0; i < totalCards; i++) {

            const card = cards.nth(i);

            await card.scrollIntoViewIfNeeded();

            const tituloLocator = card.locator('h2');

            const titulo = (await tituloLocator.textContent())?.trim() || "";

            console.log(`🖥️ Carrera ${i + 1}: ${titulo}`);

            await card.screenshot({
                path: rutaCaptura(i + 1, titulo)
            });

            const boton = card.locator('img[alt="dislike"]');

            await boton.scrollIntoViewIfNeeded();
            await boton.click({ force: true });

            await this.page.waitForTimeout(800);
        }
        /*
        await this.clickElement(this.saberMasButton);
        await this.waitForElementVisible(this.asesoria);
        await this.clickElement(this.opcionAsesoriaSi);*/

        console.log("✅ Iteración completada");
    }
}