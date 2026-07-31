import {Given,When,Then} from '@cucumber/cucumber';
import {chromium,Browser,Page,expect} from '@playwright/test';
import {pageFixture} from '../../hooks/pageFixture';
import {Registrate} from '../pages/registratePage';
import { generateUserData } from "../utils/dataGenerator";

let browser : Browser;
let registratePage: Registrate;
let page: Page;

Given('el usuario ingresa a la página principal de UPN',async function(){
    registratePage = new Registrate(pageFixture.page);
    await registratePage.navigate();
});

When('el usuario da clic en Regístrate',async function(){
    await registratePage.clickRegistrate();
});

When('el usuario ingresa sus datos personales',async function(){
    const user = generateUserData();    
    await registratePage.enterData(
    user.documentType,
    user.documentNumber,
    user.names,
    user.lastName1,
    user.lastName2,
    user.birthDate,
    user.phone,
    user.email,
    user.colegio,
    user.grado,
    user.carrera,
    user.campus
    );
});

When('el usuario da clic en Continuar',async function(){
    await registratePage.continueButtonP();
});

Then('se muestra pantalla de TOV',async function() {
    await registratePage.validarDimensiones();
    console.log("ESTO ES UN ÉXITO");
})