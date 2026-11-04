import {When, Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {RegistroMasTov} from '../pages/registroMasTovPage';
import {appendTestData} from '../utils/dataGenerator';

When('el usuario llega a Tu ruta seleccionando lo que valora {string} y el financiamiento {string}', async function (valora: string, financiamiento: string) {
    const aplico = await new RegistroMasTov(pageFixture.page).llegarATuRuta(valora, financiamiento);
    appendTestData(`Llegó a Tu ruta (valora: ${aplico.valora ? valora : 'no aplicó'}, financiamiento: ${aplico.financiamiento ? financiamiento : 'no aplicó'})`);
});

Then('en Tu ruta no se muestra la card de Conócete', async function () {
    await new RegistroMasTov(pageFixture.page).validarSinCardConocete();
});
