import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import { Evidencias } from "../helper/evidencias";

// Estado compartido entre steps de un mismo escenario (en vez de variables globales por archivo).
export class CustomWorld extends World {
    // true si el usuario está en 5to (hace BigFive); lo definen los steps de login / registro
    esQuinto?: boolean;
    // capturas de evidencia del escenario, nombradas con el documento usado
    readonly evidencias = new Evidencias();

    constructor(options: IWorldOptions) {
        super(options);
    }
}

setWorldConstructor(CustomWorld);
