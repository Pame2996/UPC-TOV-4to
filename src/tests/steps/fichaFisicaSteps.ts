import {Given,When,Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {FichaFisica} from '../pages/fichaFisicaPage';
import { generateUserData, generateApoderadoData, appendTestData } from "../utils/dataGenerator";
import { guardarEvidencia } from "../../helper/evidencias";

let fichaFisicaPage: FichaFisica;

Given('el usuario ingresa a la página de registro de ficha física', async function () {
    // Las evidencias de ficha física van a evidencias/FF_<documento>
    process.env.EVIDENCIA_PREFIJO = "FF_";
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

// Dos carreras en orden (la primera queda como primera opción).
// TEST_CARRERA1 / TEST_CARRERA2 permiten cambiarlas desde CMD sin editar el feature.
When('el usuario selecciona las carreras de preferencia {string} y {string}', async function (primera: string, segunda: string) {
    const c1 = process.env.TEST_CARRERA1 || primera;
    const c2 = process.env.TEST_CARRERA2 || segunda;
    await fichaFisicaPage.selectCareer(c1);
    await fichaFisicaPage.selectCareer(c2);
    await fichaFisicaPage.validarCarrerasSeleccionadas([c1, c2]);
    appendTestData(`Ficha física - Carreras: 1) ${c1}  2) ${c2}`);
    await guardarEvidencia(pageFixture.page, "seleccion-carreras");
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
