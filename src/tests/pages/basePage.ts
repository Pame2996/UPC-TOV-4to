import {Locator, Page} from "@playwright/test";

export default class BasePage{
    readonly page:Page;

    constructor(page:Page){
        this.page = page;
    }    

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async clickElement(element: Locator) {
        await element.click();
    }

    async fillFormField(element: Locator, value: string) {
        await this.clickElement(element);
        await element.fill("");
        await element.fill(value);
    }

    async getElementText(element: Locator): Promise<string> {
        return element.innerText();
    }

    async waitForElementVisible(element: Locator | string) {
        if (typeof element === 'string') {
            await this.page.waitForSelector(element, { state: 'visible' });
        } else {
            await element.waitFor({ state: 'visible' });
        }
    }

    async waitForElementHidden(element: Locator | string) {
        if (typeof element === 'string') {
            await this.page.waitForSelector(element, { state: 'hidden' });
        } else {
            await element.waitFor({ state: 'hidden' });
        }
    }

    async takeScreenshot(fileName: string) {
        await this.page.screenshot({ path: fileName });
    }

    normalizarTexto(texto: string): string {
    return (texto ?? "")
        .trim()
        .replace(/\s+/g, " ")                  // colapsa espacios / saltos de línea
        .replace(/[“”]/g, '"')                 // comillas “ ”
        .replace(/[’‘]/g, "'")                 // comillas ‘ ’
        .normalize("NFD")                      // separa acentos
        .replace(/[\u0300-\u036f]/g, "")       // quita acentos (tildes)
        .toLowerCase();
    }

    encontrarMasParecida(actual: string, esperadas: string[]): string {
        const a = this.normalizarTexto(actual);

        let mejor = "";
        let mejorScore = -1;

        for (const e of esperadas) {
            const b = this.normalizarTexto(e);
            const score = this.similitudJaccard(a, b);
            if (score > mejorScore) {
            mejorScore = score;
            mejor = e;
            }
        }
        return mejor ? `${mejor} (score=${mejorScore.toFixed(2)})` : "(sin sugerencia)";
    }

    similitudJaccard(a: string, b: string): number {
        const A = new Set(a.split(" ").filter(Boolean));
        const B = new Set(b.split(" ").filter(Boolean));
        const inter = [...A].filter(x => B.has(x)).length;
        const uni = new Set([...A, ...B]).size;
        return uni === 0 ? 0 : inter / uni;
    }
}