import {Page,Locator} from "playwright/test";
import BasePage from './basePage';
import { expect } from "@playwright/test";
import { UserData } from "../utils/dataGenerator";
import { getBaseUrl, AMBIENTE_POR_DEFECTO } from "../utils/config";

export class Registrate extends BasePage{
    readonly page:Page;
    private readonly registrarmeButton: Locator;
    private readonly schoolInput: Locator;
    private readonly gradeInput: Locator;
    private readonly continuarButton: Locator;
    private readonly dondeEstasTuOptions: Locator;
    private readonly firstNameInput: Locator;
    private readonly firstSurnameInput: Locator;
    private readonly secondSurnameInput: Locator;
    private readonly birthdateInput: Locator;
    private readonly phoneInput: Locator;
    private readonly emailInput: Locator;
    private readonly documentTypeInput: Locator;
    private readonly documentNumberInput: Locator;
    private readonly consentCheckbox: Locator;

    constructor(page:Page){
        super(page)
        this.page = page;
        this.registrarmeButton = page.getByRole('button', { name: 'Registrarme' });
        this.schoolInput = page.locator('#school');
        this.gradeInput = page.locator('#what_grade_are_you');
        this.continuarButton = page.getByRole('button', { name: 'Continuar', exact: true });
        this.dondeEstasTuOptions = page.getByRole('listitem').locator('article');
        this.firstNameInput = page.locator('#first_name');
        this.firstSurnameInput = page.locator('#first_surname');
        this.secondSurnameInput = page.locator('#second_surname');
        this.birthdateInput = page.locator('#birthdate');
        this.phoneInput = page.locator('#phone');
        this.emailInput = page.locator('#email');
        this.documentTypeInput = page.locator('#document_type');
        this.documentNumberInput = page.locator('#document_number');
        this.consentCheckbox = page.locator('input[type="checkbox"]').first();
    }

    async navigate(){
        await this.page.goto(`${getBaseUrl(AMBIENTE_POR_DEFECTO.registro)}/`, {
            waitUntil: "domcontentloaded"
        });
    }

    async clickRegistrarme(){
        await this.waitForElementVisible(this.registrarmeButton);
        await this.registrarmeButton.scrollIntoViewIfNeeded();
        await this.registrarmeButton.click();
        await expect(this.schoolInput).toBeVisible({ timeout: 15000 });
    }

    async selectSchool(codigo: string){
        await this.fillFormField(this.schoolInput, codigo);
        // La búsqueda de colegio demora en cargar el resultado
        const option = this.page.getByRole('listitem').first();
        await this.waitForElementVisible(option);
        await this.clickElement(option);
    }

    async selectGrade(grado: string){
        await this.clickElement(this.gradeInput);
        const option = this.page.getByRole('listitem').filter({ hasText: grado }).first();
        await this.waitForElementVisible(option);
        await this.clickElement(option);
    }

    async selectDondeEstasTu(posicion: string){
        // Se parametriza por posición (1 = primera opción) porque el texto de las
        // opciones incluye comillas dobles que rompen el parseo de steps con {string}
        const option = this.dondeEstasTuOptions.nth(Number(posicion) - 1);
        await this.waitForElementVisible(option);
        await this.clickElement(option);
    }

    async selectDocumentType(tipo: string){
        await this.clickElement(this.documentTypeInput);
        const option = this.page.getByRole('listitem').filter({ hasText: tipo }).first();
        await this.waitForElementVisible(option);
        await this.clickElement(option);
    }

    async enterDatosPersonales(datos: UserData){
        await this.fillFormField(this.firstNameInput, datos.primerNombre);
        await this.fillFormField(this.firstSurnameInput, datos.primerApellido);
        await this.fillFormField(this.secondSurnameInput, datos.segundoApellido);
        await this.fillFormField(this.birthdateInput, datos.fechaNacimiento);
        await this.fillFormField(this.phoneInput, datos.celular);
        await this.fillFormField(this.emailInput, datos.correo);
        await this.selectDocumentType(datos.tipoDocumento);
        await this.fillFormField(this.documentNumberInput, datos.numeroDocumento);
        await this.clickElement(this.consentCheckbox);
    }

    async clickContinuar(){
        const currentPath = new URL(this.page.url()).pathname;
        let waitCondition: RegExp | ((url: URL) => boolean);

        if (currentPath.endsWith('/registro')) {
            waitCondition = /\/registro\/donde-estas-tu/;
        } else if (currentPath.endsWith('/donde-estas-tu')) {
            waitCondition = /\/registro\/datos-personales/;
        } else {
            waitCondition = (url: URL) => !url.pathname.endsWith('/datos-personales');
        }

        await Promise.all([
            this.page.waitForURL(waitCondition, { timeout: 30000 }),
            this.continuarButton.click(),
        ]);
    }

    async validarRegistroCompletado(){
        await expect(this.page).not.toHaveURL(/\/registro\/datos-personales/, { timeout: 15000 });
    }
}
