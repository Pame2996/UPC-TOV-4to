import fs from "fs";
import path from "path";

export const FIRST_NAMES = [
    "Prueba"
];

export const SURNAMES = [
    "Neyra", "Torres", "Rojas", "Salazar", "Quispe", "Vega", "Flores", "Gomez",
    "Ramirez", "Castillo", "Lopez", "Hernandez", "Vargas", "Paredes", "Chavez",
    "Mendoza", "Cruz", "Reyes", "Morales", "Guerrero", "Soto", "Silva", "Rios",
    "Navarro", "Campos", "Delgado", "Espinoza", "Medina", "Aguilar", "Vasquez",
    "Ortega", "Peña", "Acosta", "Cabrera", "Farfan", "Huaman", "Palomino",
    "Carranza", "Condori", "Yupanqui", "Valdez", "Benavides", "Cornejo",
    "Montoya", "Bustamante", "Cordero", "Zamora", "Luna", "Barrientos"
];

function randomFrom(list: string[]) {
    return list[Math.floor(Math.random() * list.length)];
}

function randomFechaNacimiento(): string {
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    return `${day}/${month}/2007`;
}

export interface UserData {
    primerNombre: string;
    primerApellido: string;
    segundoApellido: string;
    fechaNacimiento: string;
    celular: string;
    correo: string;
    tipoDocumento: string;
    numeroDocumento: string;
}

export function appendTestData(texto: string) {
    const filePath = path.join(process.cwd(), "test-data.txt");
    fs.appendFileSync(filePath, texto + "\n");
}

export function generateUserData(): UserData {
    const random = Math.floor(Math.random() * 90000000 + 10000000);

    const data: UserData = {
        primerNombre: randomFrom(FIRST_NAMES),
        primerApellido: randomFrom(SURNAMES),
        segundoApellido: randomFrom(SURNAMES),
        fechaNacimiento: randomFechaNacimiento(),
        celular: "9" + Math.floor(Math.random() * 90000000 + 10000000),
        correo: `test_${random}@mail.com`,
        tipoDocumento: "DNI",
        numeroDocumento: random.toString(),
    };
    saveToTxt(data);
    return data;
}

export interface ApoderadoData {
    nombre: string;
    celular: string;
}

export function generateApoderadoData(): ApoderadoData {
    const data: ApoderadoData = {
        nombre: `${randomFrom(FIRST_NAMES)} ${randomFrom(SURNAMES)}`,
        celular: "9" + Math.floor(Math.random() * 90000000 + 10000000),
    };
    appendTestData(
        `Apoderado: ${data.nombre}\n` +
        `Celular apoderado: ${data.celular}`
    );
    return data;
}

function saveToTxt(data: UserData) {
    appendTestData(
        `Nombre: ${data.primerNombre} ${data.primerApellido} ${data.segundoApellido}\n` +
        `Nacimiento: ${data.fechaNacimiento}\n` +
        `Celular: ${data.celular}\n` +
        `Correo: ${data.correo}\n` +
        `Documento: ${data.tipoDocumento} - ${data.numeroDocumento}`
    );
}
