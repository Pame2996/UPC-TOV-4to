import {Given,When,Then} from '@cucumber/cucumber';
import {pageFixture} from '../../hooks/pageFixture';
import {Login} from '../pages/loginPage';
import {ValidaCarreras} from '../pages/validarCarrerasPage';

let validarCarreras: ValidaCarreras;

Given('el usuario completa el test',async function(){
    const loginPage = new Login(pageFixture.page);
    await loginPage.navigate();
    await loginPage.iniciarButtonP();
    await loginPage.seleccionarTipo("DNI");
    await loginPage.ingresarDocumento("18476999");
    await loginPage.ingresarCelular("900000001");
    await loginPage.continuarButtonP();
    await loginPage.validarInicio();
    validarCarreras = new ValidaCarreras(pageFixture.page);
});

When('da clic en Ver resultados',async function(){
});

When('visualiza las tres carreras',async function(){
    await validarCarreras.verCarreras((n, titulo) => `evidencias/18476999/18476999_Carreras_${n}-${titulo}.png`);
});

Then('da clic en botón de continuar',async function() {
    console.log("Click en el botón para descargar todo");
})
