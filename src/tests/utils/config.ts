// Ambiente y archivo de datos parametrizables por variable de entorno.
// TEST_ENV: "cert" | "dev" | "prod". Si no se define, cada flujo usa el ambiente que ya tenía por defecto.
// TEST_DATA_FILE: nombre del archivo Excel en src/tests/data (ej. "Carreras_5.xlsx").

const ENVIRONMENTS: Record<string, string> = {
    cert: "https://colegios-prospeccion-fe-cert-upc.stage02.link",
    dev: "https://colegios-prospeccion-fe-dev-upc.stage02.link",
    prod: "https://decidetufuturo.upc.edu.pe",
};

// Ambiente por defecto de cada flujo cuando no se define TEST_ENV. Lo usan las páginas (para navegar)
// y los steps (para nombrar las evidencias), así el nombre siempre coincide con el ambiente real.
export const AMBIENTE_POR_DEFECTO = {
    login: "dev",
    registro: "cert",
    fichaFisica: "cert",
};

// Nombre del ambiente de la ejecución (cert | dev | prod)
export function getEnvName(defaultEnv: string): string {
    const env = process.env.TEST_ENV || defaultEnv;
    if (!ENVIRONMENTS[env]) {
        throw new Error(`Ambiente desconocido: "${env}". Usa uno de: ${Object.keys(ENVIRONMENTS).join(', ')}`);
    }
    return env;
}

export function getBaseUrl(defaultEnv: string): string {
    return ENVIRONMENTS[getEnvName(defaultEnv)];
}

export function getTestDataFile(): string {
    return process.env.TEST_DATA_FILE || "Carreras_1.xlsx";
}

// Documento que se usa en la ejecución (registro / ficha física). Se pasa siempre por variable de
// entorno: ya no se genera uno aleatorio, para que las evidencias y el test-data lleven el documento real.
export function getTestDocument(): string {
    const documento = (process.env.TEST_DNI || "").trim();
    if (!documento) {
        throw new Error('Falta el documento de prueba: define la variable TEST_DNI (ej. set TEST_DNI=27102601)');
    }
    return documento;
}

const TIPOS_DOCUMENTO = ["DNI", "Pasaporte", "Carnet"];

// Tipo de documento de la ejecución. Si se define TEST_TIPO_DOC (DNI | Pasaporte | Carnet) manda sobre
// el valor del Examples del feature; si no, se usa el del feature.
export function getTestDocumentType(porDefecto: string): string {
    const elegido = (process.env.TEST_TIPO_DOC || "").trim() || porDefecto;
    const tipo = TIPOS_DOCUMENTO.find((t) => t.toLowerCase() === elegido.toLowerCase());
    if (!tipo) {
        throw new Error(`Tipo de documento desconocido: "${elegido}". Usa uno de: ${TIPOS_DOCUMENTO.join(", ")} (variable TEST_TIPO_DOC)`);
    }
    return tipo;
}
