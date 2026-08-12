import {Page,Locator, FrameLocator} from "playwright/test";
import BasePage from './basePage';
import { expect } from "@playwright/test";
import { getBaseUrl } from "../utils/config";

export class Login extends BasePage{
    readonly page:Page;
    private readonly inicioButton: Locator;
    private readonly tipoDocumento: Locator;
    private readonly documentNumber: Locator;
    private readonly phoneNumberInput: Locator;
    private readonly continuarButton: Locator;
    private readonly resultadosButton: Locator;


    constructor(page:Page){
        super(page)
        this.page=page;
        this.inicioButton = page.getByRole('button', { name: 'Ya tengo cuenta' });
        this.tipoDocumento = page.locator("#document_type");
        this.documentNumber = page.locator("#document_number");
        this.phoneNumberInput = page.locator("#phone");
        this.continuarButton = page.getByRole("button",{name: "Ingresar"});
        this.resultadosButton = page.getByRole("button",{name: "Ver resultados"});

    }

    async navigate(){
        await this.page.goto(`${getBaseUrl('dev')}/`, {
            waitUntil: "domcontentloaded"
        });

        await this.page.waitForLoadState("networkidle");
    }

    async iniciarButtonP(){
        console.log("Clic en el botón iniciar")
        /*await this.waitForElementVisible(this.inicioButton);
        await this.clickElement(this.inicioButton);*/

        await this.page.waitForSelector('button:has-text("Ya tengo cuenta")', {
            state: "visible",
            timeout: 15000
        });

        await this.inicioButton.scrollIntoViewIfNeeded();
        await this.inicioButton.click({ force: true });
        await expect(this.documentNumber).toBeVisible({ timeout: 10000 });
    }

    async seleccionarTipo(tipo:string){
        console.log("Tipo Documento")
        await this.tipoDocumento.click();
        const opcion = this.page.getByRole('listitem').filter({ hasText: tipo });
        await opcion.click();
    }

    async ingresarDocumento(document:string){
        console.log("Documento")
        await this.waitForElementVisible(this.documentNumber);
        await this.fillFormField(this.documentNumber,document);
        this.page.on("console", msg => console.log("Browser log:", msg.text()));
        //await this.page.pause();
    }

    async ingresarCelular(phone:string){
        console.log("Celular")
        await this.waitForElementVisible(this.phoneNumberInput);
        await this.fillFormField(this.phoneNumberInput,phone);
    }

    async continuarButtonP(){
        console.log("Continuar botón");
        //this.clickElement(this.continuarButton);
        await Promise.all([
            this.page.waitForURL(/test-vocacional|dimensiones|prospecto/i, { timeout: 20000 }),
            this.continuarButton.click(),
        ]);
    }

    async validarInicio(){
        console.log ("ingresé a la validación");
        //this.waitForElementVisible(this.resultadosButton);
        await expect(this.resultadosButton.first()).toBeVisible({ timeout: 15000 });
    }
}   