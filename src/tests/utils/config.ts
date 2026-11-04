// Ambiente y archivo de datos parametrizables por variable de entorno.
// TEST_ENV: "cert" | "dev" | "prod". Si no se define, cada flujo usa el ambiente que ya tenía por defecto.
// TEST_DATA_FILE: nombre del archivo Excel en src/tests/data (ej. "Carreras_5.xlsx").

const ENVIRONMENTS: Record<string, string> = {
    cert: "https://colegios-prospeccion-fe-cert-upc.stage02.link",
    dev: "https://colegios-prospeccion-fe-dev-upc.stage02.link",
    prod: "https://decidetufuturo.upc.edu.pe",
};

export function getBaseUrl(defaultEnv: string): string {
    const env = process.env.TEST_ENV || defaultEnv;
    const url = ENVIRONMENTS[env];
    if (!url) {
        throw new Error(`Ambiente desconocido: "${env}". Usa uno de: ${Object.keys(ENVIRONMENTS).join(', ')}`);
    }
    return url;
}

export function getTestDataFile(): string {
    return process.env.TEST_DATA_FILE || "Carreras_20.xlsx";
}
