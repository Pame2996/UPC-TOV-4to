import {Page,Locator} from "playwright/test";
import BasePage from './basePage';

function escapeRegExp(texto: string): string {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class RegistroMasTov extends BasePage{
    readonly page:Page;
    private readonly firstCareerInput: Locator;
    private readonly secondCareerInput: Locator;
    private readonly continuarButtons: Locator;
    private readonly noLoTengoDecididoButton: Locator;
    private readonly comenzarRutaButton: Locator;
    private readonly comenzarAventuraButton: Locator;
    private readonly excelenteButton: Locator;
    private readonly preguntaAbiertaInput: Locator;
    private readonly continuarPreguntaAbiertaButton: Locator;

    constructor(page:Page){
        super(page)
        this.page = page;
        this.firstCareerInput = page.locator('#firstCareer');
        this.secondCareerInput = page.locator('#secondCareer');
        this.continuarButtons = page.getByRole('button', { name: 'Continuar', exact: true });
        this.noLoTengoDecididoButton = page.getByRole('button', { name: 'No lo tengo decidido' });
        this.comenzarRutaButton = page.getByRole('button', { name: '¡Comenzar!', exact: true });
        this.comenzarAventuraButton = page.getByRole('button', { name: '¡Comenzar la aventura!' });
        this.excelenteButton = page.getByRole('button', { name: '¡Excelente!' });
        this.preguntaAbiertaInput = page.getByRole('textbox');
        this.continuarPreguntaAbiertaButton = page.getByRole('button', { name: /Vamos|Sigamos/i });
    }

    private tarjetaPorTitulo(titulo: string): Locator {
        return this.page.locator('article').filter({
            has: this.page.locator('p', { hasText: new RegExp(`^${escapeRegExp(titulo)}$`) })
        });
    }

    private async seleccionarTarjeta(titulo: string){
        await this.clickElement(this.tarjetaPorTitulo(titulo));
        // Deja que la selección se refleje en el DOM antes de continuar (igual que en el TOV ya automatizado)
        await this.page.waitForTimeout(500);
    }

    private async seleccionarCarrera(input: Locator, carrera: string){
        await this.clickElement(input);
        // Una coincidencia exacta oculta la lista de opciones; se escribe un prefijo para forzar que aparezca
        const prefijo = carrera.length > 4 ? carrera.slice(0, carrera.length - 2) : carrera;
        await input.pressSequentially(prefijo, { delay: 20 });
        const opcion = this.page.getByRole('listitem').filter({ hasText: carrera }).first();
        await this.waitForElementVisible(opcion);
        await this.clickElement(opcion);
    }

    async seleccionarCarreras(primera: string, segunda: string){
        await this.seleccionarCarrera(this.firstCareerInput, primera);
        await this.seleccionarCarrera(this.secondCareerInput, segunda);
        await this.clickContinuar();
    }

    async clickContinuar(){
        const urlAntes = this.page.url();
        await this.continuarButtons.first().click();
        try {
            await this.page.waitForURL((url) => url.toString() !== urlAntes, { timeout: 5000 });
        } catch {
            // Algunas pantallas muestran un modal de progreso ("¡Sigue así!") con un Continuar adicional
            const modalContinuar = this.continuarButtons.last();
            await this.waitForElementVisible(modalContinuar);
            await this.clickElement(modalContinuar);
        }
    }

    async seleccionarDondeEstudiar(opcion: string){
        await this.seleccionarTarjeta(opcion);
        await this.clickContinuar();
    }

    async seleccionarModalidad(opcion: string){
        await this.seleccionarTarjeta(opcion);
        await this.clickContinuar();
    }

    // A veces el sitio muestra un aviso transitorio ("Volvemos en un momento") en esta pantalla,
    // no es un bug: se confirma con el botón "Entendido" para poder continuar.
    private async manejarAvisoVolvemosEnUnMomento(){
        const aviso = this.page.getByText(/Volvemos en un momento/i);
        const apareceAviso = await aviso.isVisible().catch(() => false);
        if (!apareceAviso) return;

        const entendidoButton = this.page.getByRole('button', { name: 'Entendido', exact: true });
        await this.waitForElementVisible(entendidoButton);
        await this.clickElement(entendidoButton);
        await aviso.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    async omitirUniversidad(){
        await this.manejarAvisoVolvemosEnUnMomento();
        const urlAntes = this.page.url();
        await this.clickElement(this.noLoTengoDecididoButton);
        try {
            await this.page.waitForURL((url) => url.toString() !== urlAntes, { timeout: 15000 });
        } catch {
            // El aviso pudo aparecer justo al confirmar; se maneja y se reintenta una vez
            await this.manejarAvisoVolvemosEnUnMomento();
            await this.clickElement(this.noLoTengoDecididoButton);
            await this.page.waitForURL((url) => url.toString() !== urlAntes, { timeout: 15000 });
        }
    }

    async confirmarTuRuta(){
        // Esta pantalla solo aplica a 4to/5to; para egresado el sitio la salta
        if (!this.page.url().includes('/tu-ruta')) return;
        await this.waitForElementVisible(this.comenzarRutaButton);
        await this.clickElement(this.comenzarRutaButton);
    }

    async seleccionarValoras(opcion: string): Promise<boolean> {
        // Esta pantalla solo aplica a 5to/egresado; para 4to el sitio la salta
        if (!this.page.url().includes('que-valoras-de-la-universidad')) return false;
        await this.seleccionarTarjeta(opcion);
        await this.clickContinuar();
        return true;
    }

    async seleccionarFinanciamiento(opcion: string): Promise<boolean> {
        // Esta pantalla solo aplica a 5to/egresado; para 4to el sitio la salta
        if (!this.page.url().includes('como-financiaras-tus-estudios')) return false;
        await this.seleccionarTarjeta(opcion);
        await this.clickContinuar();
        return true;
    }

    async iniciarAventura(){
        // La pantalla "tu-ruta" no siempre aparece en el mismo punto (antes o después de
        // valoras/financiaras según el grado); se confirma aquí también por si sigue pendiente
        await this.confirmarTuRuta();
        await this.waitForElementVisible(this.comenzarAventuraButton);
        await this.clickElement(this.comenzarAventuraButton);
    }

    // Sondeo desde Node en vez de page.waitForFunction: el sitio bloquea eval en la página vía CSP
    private async esperarCampoVacio(timeoutMs = 15000){
        const limite = Date.now() + timeoutMs;
        while (Date.now() < limite) {
            const valor = await this.preguntaAbiertaInput.inputValue().catch(() => null);
            if (valor === '') return;
            await this.page.waitForTimeout(150);
        }
    }

    async responderPreguntasAbiertas(respuestas: string[]){
        for (const respuesta of respuestas) {
            // Confirma que el campo de la pregunta nueva está realmente listo (vacío) antes de
            // escribir; si la transición de pantalla no terminó, se pisaría la respuesta anterior
            await this.esperarCampoVacio();
            const urlAntes = this.page.url();
            await this.fillFormField(this.preguntaAbiertaInput, respuesta);
            // Confirma que el contador de caracteres refleja el texto antes de continuar
            // (si se hace demasiado rápido, el clic puede caer con el campo aún vacío)
            await this.page.getByText(`${respuesta.length}/360`).waitFor({ state: 'visible', timeout: 5000 });
            await this.waitForElementVisible(this.continuarPreguntaAbiertaButton);
            await this.clickElement(this.continuarPreguntaAbiertaButton);
            // Confirma que la pregunta avanzó antes de seguir con la siguiente
            await this.page.waitForURL((url) => url.toString() !== urlAntes, { timeout: 15000 });
        }
    }

    async finalizarAutoconocimiento(){
        await this.waitForElementVisible(this.excelenteButton);
        const urlAntes = this.page.url();
        await this.clickElement(this.excelenteButton);
        // Espera a que navegue a /conocete/test-vocacional/{quinto|cuarto} antes de continuar;
        // si no se confirma, esQuinto() puede leer la URL vieja y saltarse el BigFive
        await this.page.waitForURL((url) => url.toString() !== urlAntes, { timeout: 15000 });
    }

    esQuinto(): boolean {
        return this.page.url().includes('/quinto');
    }
}
