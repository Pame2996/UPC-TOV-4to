import {Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';

Then('se muestra la pantalla de inicio del test vocacional', async function () {
    const comenzarTestButton = pageFixture.page.getByRole('button', { name: '¡Comenzar el test!' });
    await comenzarTestButton.waitFor({ state: 'visible' });
});
