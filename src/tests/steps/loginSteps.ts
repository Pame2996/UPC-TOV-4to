import {Given,When,Then} from '@cucumber/cucumber';
import {chromium,Browser,Page,expect} from '@playwright/test';
import {pageFixture} from '../../hooks/pageFixture';
import {Login} from '../pages/loginPage';
import {RealizaTOVBigFive} from '../pages/realizarTOVBigFivePage';
import {RealizaTOVRiasec} from '../pages/realizarTOVRiasecPage';
import {RealizaTOVVocare} from '../pages/realizarTOVVocarePage';
import { ValidaCarreras } from '../pages/validarCarrerasPage';

let browser : Browser;
let loginPage:Login;
let page: Page;
let realizarTOVPage: RealizaTOVBigFive;
let realizarTOVPage2: RealizaTOVRiasec;
let realizarTOVPage3: RealizaTOVVocare;
let verResultados: ValidaCarreras;

let dni: string;
let seccion: string;

Given('el usuario se encuentra en la página de inicio',async function(){
    loginPage = new Login(pageFixture.page);
    await loginPage.navigate();
});

When('ingresa a la opcion Ya tengo cuenta',async function(){
    await loginPage.iniciarButtonP();
});

When('ingresa el DNI {string} de la seccion {string} con tipo de documento {string}',async function(dniParam:string, seccionParam:string, tipoDocumento:string){
    dni = dniParam;
    seccion = seccionParam;
    await loginPage.seleccionarTipo(tipoDocumento);
    await loginPage.ingresarDocumento(dni);
});

When('ingresa el número de celular',async function(){
    await loginPage.ingresarCelular("900999999")
});

When('da clic en Continuar',async function(){
    await loginPage.continuarButtonP();
});

Then('inicia el test de personalidad',async function(){
    realizarTOVPage = new RealizaTOVBigFive(pageFixture.page);
    await realizarTOVPage.iniciarTest();
    if (seccion === '5to') {
        await realizarTOVPage.responderPersonalidad(dni);
    }
});

Then('responde el test de Riasec',async function(){
    realizarTOVPage2 = new RealizaTOVRiasec(pageFixture.page);
    await realizarTOVPage2.responderIntereses(dni);
});

Then('responde el test de Vocare',async function(){
    realizarTOVPage3 = new RealizaTOVVocare(pageFixture.page);
    await realizarTOVPage3.responderHabilidades(dni);
});

Then('visualiza y valida los resultados de carreras',async function(){
    verResultados = new ValidaCarreras(pageFixture.page);
    let grado: string;
    if (seccion === '5to') {
        grado = '1'; // Quinto
    } else {
        grado = '2'; // Cuarto
    }
    await verResultados.visualizarResultados(grado);
    await verResultados.verCarreras(dni);
});