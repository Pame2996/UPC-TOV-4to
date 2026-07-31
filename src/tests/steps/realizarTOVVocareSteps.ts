import {Given,When,Then} from '@cucumber/cucumber';
import {chromium,Browser,Page,expect} from '@playwright/test';
import {pageFixture} from '../../hooks/pageFixture';
import { generateUserData } from "../utils/dataGenerator";
import { RealizaTOVVocare } from '../pages/realizarTOVVocarePage';

let browser : Browser;
let realizarTOVPage: RealizaTOVVocare;
let page: Page;

Given('el usuario ha realizado el registro',async function(){
    realizarTOVPage = new RealizaTOVVocare(pageFixture.page);
    //const user = generateUserData();  
});

When('da clic en Habilidades',async function(){
});

When('visualiza el test de Habilidades',async function(){
    await realizarTOVPage.visualizarHabilidades();
});


Then('responde las 60 preguntas aleatorias',async function() {
})