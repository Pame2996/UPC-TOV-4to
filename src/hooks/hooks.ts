import { BeforeAll, Before, After, AfterStep, AfterAll, Status, ITestCaseHookParameter, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, webkit , Browser, BrowserContext, Page } from "@playwright/test";
import { pageFixture } from './pageFixture';
import fs from "fs";
// Import con efecto: registra el World personalizado (con solo el import de tipos, TypeScript lo elimina)
import "./world";
import type { CustomWorld } from "./world";
import { pantallaDesdeUrl, flujoDesdeUri } from "../helper/evidencias";

let browser: Browser;
let context: BrowserContext;
let page: Page;

//setDefaultTimeout(90000);
setDefaultTimeout(180000);

BeforeAll(async function () {
  // En CI (GitHub Actions setea CI=true automáticamente) no hay pantalla disponible,
  // así que corre headless ahí; localmente se sigue viendo el navegador como siempre.
  browser = await chromium.launch({ headless: !!process.env.CI });
  //browser = await webkit.launch({headless:false});
});

Before(async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {
  // El flujo sale del feature que se está ejecutando (login, registro, registromastov...)
  this.evidencias.fijar("flujo", flujoDesdeUri(pickle.uri));
  context = await browser.newContext({
    //viewport: { width: 1600, height: 900 },
    viewport:{width: 1280, height: 800},
    deviceScaleFactor: 1
  });

  page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(80000);
  pageFixture.page = page; // ya sin ts-ignore, porque page está tipado

  const mundo = this as any; // (this.context no está tipado en el World; se conserva el comportamiento original)
  if (mundo.context) {
        await mundo.context.clearCookies();
        await mundo.context.clearPermissions();
  }
});

After(async function (this: CustomWorld, { result }: ITestCaseHookParameter) {
  if (result?.status === Status.FAILED) {
    try {
      const image = await this.evidencias.capturar(pageFixture.page, `ERROR_${pantallaDesdeUrl(pageFixture.page.url())}`);
      await this.attach(image, "image/png");
    } catch (error) {
      console.error("No se pudo capturar la evidencia del error:", error);
    }
  }
  this.evidencias.cerrar();
  //await page.close();
  //await context.close();
  //await page.pause();
});

// Una captura de pantalla completa por paso en evidencias/<documento>/ (también se adjunta al reporte HTML)
AfterStep(async function (this: CustomWorld) {
  try {
    const image = await this.evidencias.capturar(pageFixture.page);
    await this.attach(image, "image/png");
  } catch (error) {
    console.error("No se pudo capturar la evidencia del paso:", error);
  }
});

AfterAll(async function () {
  //await browser.close();
});