import {Page,Locator, FrameLocator} from "playwright/test";
import BasePage from './basePage';

export class Registrate extends BasePage{
    readonly page:Page;
    private readonly registrateButton: Locator;
    private readonly documentType: Locator;
    private readonly documentTypeButton: Locator;
    private readonly documentNumber: Locator;
    private readonly nameInput: Locator;
    private readonly firstLastNameInput: Locator;
    private readonly secondLastNameInput: Locator;
    private readonly birthDayInput: Locator;
    private readonly phoneNumberInput: Locator;
    private readonly emailInput: Locator;
    private readonly schoolInput: Locator;
    private readonly schoolButton: Locator;
    private readonly schoolOptions: Locator;
    private readonly grade: Locator;
    private readonly gradeButton: Locator;
    private readonly careerInput: Locator;
    private readonly careerButton: Locator;
    private readonly careerOptions: Locator;
    private readonly campus: Locator;
    private readonly campusButton: Locator;
    private readonly continueButton: Locator;
    private readonly firstCheck: Locator;
    private readonly resultadosButton: Locator;

    constructor(page:Page){
        super(page)
        this.page=page;
        this.registrateButton = page.getByRole('button', { name: 'Regístrate' });
        this.documentType = page.locator("#document_type");
        this.documentTypeButton = this.documentType.getByRole("button");
        this.documentNumber = page.locator("#document_number");
        this.nameInput = page.locator("#nombres");
        this.firstLastNameInput = page.locator("#primer_apellido");
        this.secondLastNameInput = page.locator("#segundo_apellido");
        this.birthDayInput = page.locator("#fecha_nacimiento");
        this.phoneNumberInput = page.locator("#celular");
        this.emailInput = page.locator("#correo");
        this.schoolInput = page.locator("#colegio");
        this.schoolButton = this.schoolInput.locator('input[placeholder="Ingresa tu colegio"]');
        this.schoolOptions = this.schoolInput.locator("li.lau-core-searchable-input__option");
        this.grade = page.locator("#grado");
        this.gradeButton = this.grade.getByRole("button");
        this.careerInput = page.locator("#carrera");
        this.careerButton = this.careerInput.locator('input[placeholder="Busca una carrera"]');
        this.careerOptions = this.careerInput.locator("li.lau-core-searchable-input__option");
        this.campus = page.locator("#campus");
        this.campusButton = this.campus.getByRole("button");
        this.continueButton = page.getByRole("button", { name: "Continuar" });
        this.firstCheck = page.locator('input[type="checkbox"]').nth(0);
        this.resultadosButton = page.getByRole("button",{name: "Ver resultados"});
    }

    async navigate(){
        await this.navigateTo('https://colegios-prospeccion-fe-cert-upn.stage02.link/');
    }

    async clickRegistrate(){
        await this.waitForElementVisible(this.registrateButton);
        await this.clickElement(this.registrateButton);
    }

    async selectDocumentType(option:string){
        await this.clickElement(this.documentTypeButton);
        const listbox = this.documentType.getByRole("listbox");
        await this.waitForElementVisible(listbox);
        await this.clickElement(listbox.getByRole('option', { name: option, exact: true }));
    }

    async selectSchool(option:string){
        await this.clickElement(this.schoolButton);
        await this.fillFormField(this.schoolButton,option);
        const listbox = this.page.getByRole("listbox");
        const list = this.schoolOptions.filter({ hasText: new RegExp(`^\\s*${option}\\s*-`) }).first();
        await this.waitForElementVisible(list);
        await this.clickElement(list);
    }

    async selectGrade(option:string){
        await this.clickElement(this.gradeButton);
        const listbox = this.grade.getByRole("listbox");
        await this.waitForElementVisible(listbox);
        await this.clickElement(listbox.getByRole('option',{name:option,exact:true}));
    }

    async selectCareer(option:string){
        await this.clickElement(this.careerButton);
        await this.fillFormField(this.careerButton,option);
        const listbox = this.page.getByRole("listbox");
        const list = this.careerOptions.filter({ hasText: new RegExp(option.replace(/\s+/g, "\\s+"), "i") }).first(); 
        await this.waitForElementVisible(list);
        await this.clickElement(list);
    }

    async selectCampus(option:string){
        await this.clickElement(this.campusButton);
        const listbox = this.campus.getByRole("listbox");
        await this.waitForElementVisible(listbox);
        await this.clickElement(listbox.getByRole('option',{name:option,exact:true}));
    }

    async enterData(docType:string,docNumber:string,nombre:string,apellidoPaterno:string,apellidoMaterno:string,cumple:string,
                    celular:string,correo:string,colegio:string,grado:string,carrera:string,campus:string
    ){
        await this.selectDocumentType(docType);
        await this.fillFormField(this.documentNumber,docNumber);
        await this.fillFormField(this.nameInput,nombre);
        await this.fillFormField(this.firstLastNameInput,apellidoPaterno);
        await this.fillFormField(this.secondLastNameInput,apellidoMaterno);
        await this.fillFormField(this.birthDayInput,cumple);
        await this.fillFormField(this.phoneNumberInput,celular);
        await this.fillFormField(this.emailInput,correo);
        await this.selectSchool(colegio);
        await this.selectGrade(grado);
        await this.selectCareer(carrera);
        await this.selectCampus(campus);
        await this.clickElement(this.firstCheck);
    }

    async continueButtonP(){
        await this.clickElement(this.continueButton);
    }

    async validarDimensiones(){
        await this.waitForElementVisible(this.resultadosButton);
    }
}