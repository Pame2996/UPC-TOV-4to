import {Given,When,Then} from '@cucumber/cucumber';
import {chromium,Browser,Page,expect} from '@playwright/test';
import {pageFixture} from '../../hooks/pageFixture';
import {generateUserData} from "../utils/dataGenerator";
import {RealizaTOVBigFive} from '../pages/realizarTOVBigFivePage';
import {RealizaTOVRiasec} from '../pages/realizarTOVRiasecPage';
import {RealizaTOVVocare} from '../pages/realizarTOVVocarePage';
import {ValidaCarreras} from '../pages/validarCarrerasPage'

let browser : Browser;
let realizarTOVPage: RealizaTOVBigFive;
let realizarTOVPage2: RealizaTOVRiasec;
let realizarTOVPage3: RealizaTOVVocare;
let validarCarreras: ValidaCarreras;
let page: Page;

Given('el usuario ha realizado el registro',async function(){
    
});

When('da clic en Personalidad',async function(){
});

When('visualiza el test de Personalidad',async function(){
});


Then('responde las 60 preguntas aleatorias',async function() {
    
})