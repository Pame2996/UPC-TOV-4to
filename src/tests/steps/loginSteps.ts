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

const dni = "31072601";

Given('el usuario se encuentra en la página de inicio',async function(){
    loginPage = new Login(pageFixture.page);
    await loginPage.navigate();
});

When('ingresa a la opcion Ya tengo cuenta',async function(){
    await loginPage.iniciarButtonP();
});

When('ingresa el DNI',async function(){
    await loginPage.seleccionarTipo("DNI");
    await loginPage.ingresarDocumento(dni);
});

When('ingresa el número de celular',async function(){
    await loginPage.ingresarCelular("900999999")
});

When('da clic en Continuar',async function(){
    await loginPage.continuarButtonP();
});

Then('realiza el Test',async function(){
    realizarTOVPage = new RealizaTOVBigFive(pageFixture.page);
    await realizarTOVPage.iniciarTest();
    //await realizarTOVPage.responderPersonalidad(dni);
    realizarTOVPage2 = new RealizaTOVRiasec(pageFixture.page);
    await realizarTOVPage2.responderIntereses(dni);
    realizarTOVPage3 = new RealizaTOVVocare(pageFixture.page);
    await realizarTOVPage3.responderHabilidades(dni);
    verResultados = new ValidaCarreras(pageFixture.page);
    //1: Quinto
    //2: Cuarto 
    await verResultados.visualizarResultados("2");
    await verResultados.verCarreras(dni);
}); 