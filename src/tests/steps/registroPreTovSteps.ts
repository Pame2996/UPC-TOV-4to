import {Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {RealizaTOVBigFive} from '../pages/realizarTOVBigFivePage';

Then('se muestra la pantalla de inicio del test vocacional', async function () {
    await new RealizaTOVBigFive(pageFixture.page).validarPantallaInicioTest();
});
