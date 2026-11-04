import {Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {CustomWorld} from '../../hooks/world';
import {RealizaTOVBigFive} from '../pages/realizarTOVBigFivePage';
import {RealizaTOVRiasec} from '../pages/realizarTOVRiasecPage';
import {RealizaTOVVocare} from '../pages/realizarTOVVocarePage';
import {ValidaCarreras} from '../pages/validarCarrerasPage';
import { appendTestData } from "../utils/dataGenerator";

// Steps del TOV compartidos por los flujos de login y de registro.
// El flujo previo deja en el World: esQuinto y el documento de las evidencias (this.evidencias).

Then('inicia el test de personalidad', async function (this: CustomWorld) {
    const realizarTOVPage = new RealizaTOVBigFive(pageFixture.page);
    await realizarTOVPage.iniciarTest();
    if (this.esQuinto) {
        await realizarTOVPage.responderPersonalidad();
    }
});

Then('responde el test de Riasec', async function () {
    await new RealizaTOVRiasec(pageFixture.page).responderIntereses();
});

Then('responde el test de Vocare', async function () {
    await new RealizaTOVVocare(pageFixture.page).responderHabilidades();
});

Then('visualiza y valida los resultados de carreras', async function (this: CustomWorld) {
    const verResultados = new ValidaCarreras(pageFixture.page);
    await verResultados.visualizarResultados(this.esQuinto ? '1' : '2');
    // Espera a que las tarjetas carguen antes de leerlas; si no, se lee la lista vacía
    const carreras = await verResultados.obtenerCarrerasCompatibles();
    appendTestData(`Carreras compatibles (resultado TOV): ${carreras.join(', ')}`);
    // La página no conoce rutas: el World le dice dónde guardar la captura de cada tarjeta
    await verResultados.verCarreras((n, titulo) => this.evidencias.rutaArchivo(`Carreras_${n}-${titulo}`));
});
