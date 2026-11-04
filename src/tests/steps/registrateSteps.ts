import {Given,When,Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {Registrate} from '../pages/registratePage';
import { generateUserData, appendTestData } from "../utils/dataGenerator";
import { getTestDocument, getEnvName, AMBIENTE_POR_DEFECTO } from "../utils/config";
import { gradoCorto } from "../../helper/evidencias";
import { CustomWorld } from '../../hooks/world';

let registratePage: Registrate;

Given('el usuario ingresa a la página principal de UPC', async function (this: CustomWorld) {
    // El documento se pasa por TEST_DNI; con él se nombran las evidencias
    this.evidencias.fijar('ambiente', getEnvName(AMBIENTE_POR_DEFECTO.registro));
    this.evidencias.fijar('documento', getTestDocument());
    registratePage = new Registrate(pageFixture.page);
    await registratePage.navigate();
    appendTestData(`\n==== Ejecución ${new Date().toISOString()} ====\nURL: ${pageFixture.page.url()}`);
});

When('el usuario da clic en Registrarme', async function () {
    await registratePage.clickRegistrarme();
});

When('el usuario selecciona el colegio con código {string}', async function (codigo: string) {
    await registratePage.selectSchool(codigo);
    appendTestData(`Colegio (código): ${codigo}`);
});

When('el usuario selecciona el grado {string}', async function (this: CustomWorld, grado: string) {
    this.evidencias.fijar('grado', gradoCorto(grado));
    await registratePage.selectGrade(grado);
    appendTestData(`Grado: ${grado}`);
});

When('el usuario selecciona la opción {string} en la pantalla Dónde estás tú', async function (posicion: string) {
    await registratePage.selectDondeEstasTu(posicion);
    appendTestData(`Dónde estás tú (opción): ${posicion}`);
});

When('el usuario da clic en Continuar', async function () {
    await registratePage.clickContinuar();
});

When('el usuario ingresa sus datos personales con tipo de documento {string}', async function (tipoDocumento: string) {
    // TEST_TIPO_DOC, si está definido, manda sobre el tipo del Examples
    const datos = generateUserData(tipoDocumento);
    await registratePage.enterDatosPersonales(datos);
});

Then('se completa el registro y avanza a la siguiente pantalla', async function () {
    await registratePage.validarRegistroCompletado();
});
