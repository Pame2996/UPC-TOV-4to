import {Given,When,Then} from '@cucumber/cucumber';
import {chromium,Browser,Page,expect} from '@playwright/test';
import {pageFixture} from '../../hooks/pageFixture';
import { ValidaCarreras } from '../pages/validarCarrerasPage';

let browser : Browser;
let validarCarreras: ValidaCarreras;
let page: Page;

Given('el usuario completa el test',async function(){
    validarCarreras = new ValidaCarreras(pageFixture.page);
    //const user = generateUserData();  
    await validarCarreras.iniciarSesion("18476999","900000001");
});

When('da clic en Ver resultados',async function(){
});

When('visualiza las tres carreras',async function(){
    await validarCarreras.verCarreras();
});

Then('da clic en botón de continuar',async function() {
    console.log("Click en el botón para descargar todo");
})