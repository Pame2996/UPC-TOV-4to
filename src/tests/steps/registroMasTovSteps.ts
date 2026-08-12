import {When,Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {RegistroMasTov} from '../pages/registroMasTovPage';
import {RealizaTOVBigFive} from '../pages/realizarTOVBigFivePage';
import {RealizaTOVRiasec} from '../pages/realizarTOVRiasecPage';
import {RealizaTOVVocare} from '../pages/realizarTOVVocarePage';
import {ValidaCarreras} from '../pages/validarCarrerasPage';
import { appendTestData } from "../utils/dataGenerator";

let registroMasTovPage: RegistroMasTov;
let esQuinto: boolean;
let screenshotId: string;

When('el usuario selecciona sus carreras de interés {string} y {string}', async function (primera: string, segunda: string) {
    registroMasTovPage = new RegistroMasTov(pageFixture.page);
    await registroMasTovPage.seleccionarCarreras(primera, segunda);
    appendTestData(`Carreras de interés: ${primera}, ${segunda}`);
});

When('el usuario selecciona dónde quiere estudiar {string}', async function (opcion: string) {
    await registroMasTovPage.seleccionarDondeEstudiar(opcion);
    appendTestData(`Dónde quiere estudiar: ${opcion}`);
});

When('el usuario selecciona la modalidad de estudio {string}', async function (opcion: string) {
    await registroMasTovPage.seleccionarModalidad(opcion);
    appendTestData(`Modalidad de estudio: ${opcion}`);
});

When('el usuario omite la selección de universidad', async function () {
    await registroMasTovPage.omitirUniversidad();
    appendTestData(`Universidad: No lo tengo decidido`);
});

When('el usuario confirma su ruta', async function () {
    await registroMasTovPage.confirmarTuRuta();
});

When('el usuario selecciona lo que más valora de la universidad {string}', async function (opcion: string) {
    const aplico = await registroMasTovPage.seleccionarValoras(opcion);
    if (aplico) appendTestData(`Valora de la universidad: ${opcion}`);
});

When('el usuario selecciona cómo financiará sus estudios {string}', async function (opcion: string) {
    const aplico = await registroMasTovPage.seleccionarFinanciamiento(opcion);
    if (aplico) appendTestData(`Financiamiento: ${opcion}`);
});

When('el usuario inicia la aventura de autoconocimiento', async function () {
    await registroMasTovPage.iniciarAventura();
});

When('el usuario responde las preguntas de autoconocimiento', async function () {
    const respuestas = ['Prueba Pasado', 'Prueba Presente', 'Prueba Futuro'];
    await registroMasTovPage.responderPreguntasAbiertas(respuestas);
    appendTestData(
        `Conócete - Pasado: ${respuestas[0]}\n` +
        `Conócete - Presente: ${respuestas[1]}\n` +
        `Conócete - Futuro: ${respuestas[2]}`
    );
});

When('el usuario finaliza la sección de autoconocimiento', async function () {
    await registroMasTovPage.finalizarAutoconocimiento();
});

Then('inicia el test de personalidad', async function () {
    esQuinto = registroMasTovPage.esQuinto();
    screenshotId = `registro_${Date.now()}`;
    const realizarTOVPage = new RealizaTOVBigFive(pageFixture.page);
    await realizarTOVPage.iniciarTest();
    if (esQuinto) {
        await realizarTOVPage.responderPersonalidad(screenshotId);
    }
});

Then('responde el test de Riasec', async function () {
    const realizarTOVPage2 = new RealizaTOVRiasec(pageFixture.page);
    await realizarTOVPage2.responderIntereses(screenshotId);
});

Then('responde el test de Vocare', async function () {
    const realizarTOVPage3 = new RealizaTOVVocare(pageFixture.page);
    await realizarTOVPage3.responderHabilidades(screenshotId);
});

Then('visualiza y valida los resultados de carreras', async function () {
    const verResultados = new ValidaCarreras(pageFixture.page);
    const grado = esQuinto ? '1' : '2';
    await verResultados.visualizarResultados(grado);
    const carreras = await pageFixture.page.locator('li.carousel-item h2').allTextContents();
    appendTestData(`Carreras compatibles (resultado TOV): ${carreras.map(c => c.trim()).join(', ')}`);
    await verResultados.verCarreras(screenshotId);
});
