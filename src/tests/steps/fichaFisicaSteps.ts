import {Given,When,Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {FichaFisica} from '../pages/fichaFisicaPage';
import { generateUserData, generateApoderadoData } from "../utils/dataGenerator";

let fichaFisicaPage: FichaFisica;

Given('el usuario ingresa a la página de registro de ficha física', async function () {
    fichaFisicaPage = new FichaFisica(pageFixture.page);
    await fichaFisicaPage.navigate();
});

When('el usuario completa los datos principales con colegio {string}, grado {string} y tipo de documento {string}', async function (colegio: string, grado: string, tipoDocumento: string) {
    const datos = generateUserData();
    datos.tipoDocumento = tipoDocumento;
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
