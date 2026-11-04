import {Given,When,Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {FichaFisica} from '../pages/fichaFisicaPage';
import { generateUserData, generateApoderadoData } from "../utils/dataGenerator";
import { getTestDocument, getEnvName, AMBIENTE_POR_DEFECTO } from "../utils/config";
import { gradoCorto } from "../../helper/evidencias";
import { CustomWorld } from '../../hooks/world';

let fichaFisicaPage: FichaFisica;

Given('el usuario ingresa a la página de registro de ficha física', async function (this: CustomWorld) {
    this.evidencias.fijar('ambiente', getEnvName(AMBIENTE_POR_DEFECTO.fichaFisica));
    this.evidencias.fijar('documento', getTestDocument());
    fichaFisicaPage = new FichaFisica(pageFixture.page);
    await fichaFisicaPage.navigate();
});

When('el usuario completa los datos principales con colegio {string}, grado {string} y tipo de documento {string}', async function (this: CustomWorld, colegio: string, grado: string, tipoDocumento: string) {
    this.evidencias.fijar('grado', gradoCorto(grado));
    // TEST_TIPO_DOC, si está definido, manda sobre el tipo del Examples
    const datos = generateUserData(tipoDocumento);
    await fichaFisicaPage.enterDatosPrincipales(datos, colegio, grado);
});

When('el usuario completa los datos del apoderado', async function () {
    const apoderado = generateApoderadoData();
    await fichaFisicaPage.enterDatosApoderado(apoderado);
});

When('el usuario selecciona la carrera de preferencia {string}', async function (carrera: string) {
    await fichaFisicaPage.selectCareer(carrera);
});

When('el usuario acepta el tratamiento de datos personales', async function () {
    await fichaFisicaPage.aceptarConsentimiento();
});

When('el usuario da clic en Registrar y guardar', async function () {
    await fichaFisicaPage.registrarYGuardar();
});

Then('se muestra el mensaje de registro exitoso', async function () {
    await fichaFisicaPage.validarRegistroExitoso();
});
