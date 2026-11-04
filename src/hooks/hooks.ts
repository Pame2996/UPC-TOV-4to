import { BeforeAll, Before, After, AfterStep, AfterAll, Status, ITestCaseHookParameter, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, webkit , Browser, BrowserContext, Page } from "@playwright/test";
import { pageFixture } from './pageFixture';
import fs from "fs";
import { guardarEvidencia, pantallaDesdeUrl } from "../helper/evidencias";

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

Before(async function () {
  context = await browser.newContext({
    //viewport: { width: 1600, height: 900 },
    viewport:{width: 1280, height: 800},
    deviceScaleFactor: 1
  });

  page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(80000);
  pageFixture.page = page; // ya sin ts-ignore, porque page está tipado

  if (this.context) {
        await this.context.clearCookies();
        await this.context.clearPermissions();
  }
});

After(async function (this: any, { pickle, result }: ITestCaseHookParameter) {
  if (result?.status === Status.FAILED) {
    const image = await guardarEvidencia(pageFixture.page, `ERROR_${pantallaDesdeUrl(pageFixture.page.url())}`);
    await this.attach(image, "image/png");
  }
});

// Una captura por paso en evidencias/<DNI>/<DNI>_<Pantalla>.png (también se adjunta al reporte)
AfterStep(async function (this: any, { pickle, result }: ITestCaseHookParameter){
    await pageFixture.page.waitForLoadState("domcontentloaded");
    const image = await guardarEvidencia(pageFixture.page, pantallaDesdeUrl(pageFixture.page.url()));
    await this.attach(image, "image/png");
});

AfterAll(async function () {
  //await browser.close();
});