import {Given,When} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {CustomWorld} from '../../hooks/world';
import {getTestDocumentType, getEnvName, AMBIENTE_POR_DEFECTO} from '../utils/config';
import {Login} from '../pages/loginPage';

let loginPage:Login;

Given('el usuario se encuentra en la página de inicio',async function(){
    loginPage = new Login(pageFixture.page);
    await loginPage.navigate();
});

When('ingresa a la opcion Ya tengo cuenta',async function(){
    await loginPage.iniciarButtonP();
});

When('ingresa el DNI {string} de la seccion {string} con tipo de documento {string}',async function(this: CustomWorld, dniExample:string, seccion:string, tipoExample:string){
    // TEST_DNI y TEST_TIPO_DOC, si están definidos, mandan sobre los valores del Examples
    const dni = (process.env.TEST_DNI || "").trim() || dniExample;
    const tipoDocumento = getTestDocumentType(tipoExample);
    // Los steps del TOV (tovSteps) leen estos valores del World
    this.esQuinto = seccion === '5to';
    this.evidencias.fijar('ambiente', getEnvName(AMBIENTE_POR_DEFECTO.login));
    this.evidencias.fijar('documento', dni);
    this.evidencias.fijar('grado', seccion);
    await loginPage.seleccionarTipo(tipoDocumento);
    await loginPage.ingresarDocumento(dni);
});

When('ingresa el número de celular',async function(){
    await loginPage.ingresarCelular("900999999");
});

When('da clic en Continuar',async function(){
    await loginPage.continuarButtonP();
});
