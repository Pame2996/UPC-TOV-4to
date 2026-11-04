import {When} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {RegistroMasTov} from '../pages/registroMasTovPage';
import { appendTestData } from "../utils/dataGenerator";
import {CustomWorld} from '../../hooks/world';

let registroMasTovPage: RegistroMasTov;

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

When('el usuario finaliza la sección de autoconocimiento', async function (this: CustomWorld) {
    await registroMasTovPage.finalizarAutoconocimiento();
    // finalizarAutoconocimiento espera el cambio de URL a /quinto o /cuarto; los steps del TOV leen este valor
    this.esQuinto = registroMasTovPage.esQuinto();
});
