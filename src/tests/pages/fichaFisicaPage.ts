import {Page,Locator} from "playwright/test";
import BasePage from './basePage';
import { expect } from "@playwright/test";
import { UserData, ApoderadoData } from "../utils/dataGenerator";
import { getBaseUrl, AMBIENTE_POR_DEFECTO } from "../utils/config";

export class FichaFisica extends BasePage{
    readonly page:Page;
    private readonly firstNameInput: Locator;
    private readonly paternalSurnameInput: Locator;
    private readonly maternalSurnameInput: Locator;
    private readonly schoolInput: Locator;
    private readonly gradeInput: Locator;
    private readonly birthdateInput: Locator;
    private readonly phoneInput: Locator;
    private readonly emailInput: Locator;
    private readonly documentTypeInput: Locator;
    private readonly documentNumberInput: Locator;
    private readonly parentNameInput: Locator;
    private readonly parentPhoneInput: Locator;
    private readonly careerInput: Locator;
    private readonly consentCheckbox: Locator;
    private readonly submitButton: Locator;
    private readonly successHeading: Locator;
    private readonly nuevoRegistroButton: Locator;

    constructor(page:Page){
        super(page)
        this.page = page;
        this.firstNameInput = page.locator('#first_name');
        this.paternalSurnameInput = page.locator('#paternal_surname');
        this.maternalSurnameInput = page.locator('#maternal_surname');
        this.schoolInput = page.locator('#colegio');
        this.gradeInput = page.locator('#grado');
        this.birthdateInput = page.locator('#fecha_nacimiento');
        this.phoneInput = page.locator('#phone');
        this.emailInput = page.locator('#email');
        this.documentTypeInput = page.locator('#type_document');
        this.documentNumberInput = page.locator('#document_number');
        this.parentNameInput = page.locator('#parent_name');
        this.parentPhoneInput = page.locator('#parent_phone');
        this.careerInput = page.locator('#careers');
        this.consentCheckbox = page.locator('input[type="checkbox"]').first();
        this.submitButton = page.getByRole('button', { name: 'Registrar y guardar' });
        this.successHeading = page.getByRole('heading', { name: 'REGISTRO EXITOSO' });
        this.nuevoRegistroButton = page.getByRole('button', { name: 'Nuevo registro' });
    }

    async navigate(){
        await this.page.goto(`${getBaseUrl(AMBIENTE_POR_DEFECTO.fichaFisica)}/registro-ficha-fisica`, {
            waitUntil: "domcontentloaded"
        });
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

    async selectDocumentType(tipo: string){
        await this.clickElement(this.documentTypeInput);
        const option = this.page.getByRole('listitem').filter({ hasText: tipo }).first();
        await this.waitForElementVisible(option);
        await this.clickElement(option);
    }

    async selectCareer(carrera: string){
        await this.clickElement(this.careerInput);
        // Una coincidencia exacta oculta la lista de opciones; se escribe un prefijo para forzar que aparezca
        const prefijo = carrera.length > 4 ? carrera.slice(0, carrera.length - 2) : carrera;
        await this.careerInput.pressSequentially(prefijo, { delay: 20 });
        const opcion = this.page.getByRole('listitem').filter({ hasText: carrera }).first();
        await this.waitForElementVisible(opcion);
        await this.clickElement(opcion);
    }

    async enterDatosPrincipales(datos: UserData, colegio: string, grado: string){
        await this.fillFormField(this.firstNameInput, datos.primerNombre);
        await this.fillFormField(this.paternalSurnameInput, datos.primerApellido);
        await this.fillFormField(this.maternalSurnameInput, datos.segundoApellido);
        await this.selectSchool(colegio);
        await this.selectGrade(grado);
        await this.fillFormField(this.birthdateInput, datos.fechaNacimiento);
        await this.fillFormField(this.phoneInput, datos.celular);
        await this.fillFormField(this.emailInput, datos.correo);
        await this.selectDocumentType(datos.tipoDocumento);
        await this.fillFormField(this.documentNumberInput, datos.numeroDocumento);
    }

    async enterDatosApoderado(apoderado: ApoderadoData){
        await this.fillFormField(this.parentNameInput, apoderado.nombre);
        await this.fillFormField(this.parentPhoneInput, apoderado.celular);
    }

    async aceptarConsentimiento(){
        await this.clickElement(this.consentCheckbox);
    }

    async registrarYGuardar(){
        await this.clickElement(this.submitButton);
        await this.waitForElementVisible(this.successHeading);
    }

    async validarRegistroExitoso(){
        await expect(this.successHeading).toBeVisible();
    }
}
