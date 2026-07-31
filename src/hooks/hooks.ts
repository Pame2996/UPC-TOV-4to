import { BeforeAll, Before, After, AfterStep, AfterAll, Status, ITestCaseHookParameter, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, webkit , Browser, BrowserContext, Page } from "@playwright/test";
import { pageFixture } from './pageFixture';
import fs from "fs";

let browser: Browser;
let context: BrowserContext;
let page: Page;

//setDefaultTimeout(90000);
setDefaultTimeout(180000);

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false });
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
    const image = await pageFixture.page.screenshot({ path: './test-result/screenshots/${pickle.name}.png', type: "png" });
    await this.attach(image, "image/png");
  }
  //await page.close();
  //await context.close();
  //await page.pause();
});

AfterStep(async function (this: any, { pickle, result }: ITestCaseHookParameter){
    await page.waitForLoadState("networkidle");  
    const screenshotDir = "./test-result/screenshots";
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const timestamp = Date.now();
      const stepName = pickle.name.replace(/\s+/g, "_");

      const image = await pageFixture.page.screenshot({
        path: `${screenshotDir}/${stepName}_${timestamp}.png`,
        type: "png",
        fullPage: true
      });

      await this.attach(image, "image/png");
});

AfterAll(async function () {
  //await browser.close();
});