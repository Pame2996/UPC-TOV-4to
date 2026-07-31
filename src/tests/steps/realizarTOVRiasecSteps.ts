import {Given,When,Then} from '@cucumber/cucumber';
import {chromium,Browser,Page,expect} from '@playwright/test';
import {pageFixture} from '../../hooks/pageFixture';
import { generateUserData } from "../utils/dataGenerator";
import { RealizaTOVRiasec } from '../pages/realizarTOVRiasecPage';

let browser : Browser;
let realizarTOVPage: RealizaTOVRiasec;
let page: Page;

Given('el usuario ha realizado el registro',async function(){
    realizarTOVPage = new RealizaTOVRiasec(pageFixture.page);
    //const user = generateUserData();  
});

When('da clic en Intereses',async function(){
    
});

When('visualiza el test de Intereses',async function(){
    await realizarTOVPage.visualizarIntereses();
});


Then('responde las 60 preguntas aleatorias',async function() {
    //await realizarTOVPage.responderPersonalidad("Se parece");
    //await realizarTOVPage.continuarButtonP();
})