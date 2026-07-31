import fs from "fs";
import path from "path";

export const FIRST_NAMES = [
    "María"
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

export interface UserData {
    documentType: string;
    documentNumber: string;
    names: string;
    lastName1: string;
    lastName2: string;
    birthDate: string;
    phone: string;
    email: string;
    colegio: string;
    grado: string;
    carrera: string;
    campus: string;
}

export function generateUserData(): UserData {
    const random = Math.floor(Math.random() * 90000000 + 10000000);

    const data: UserData = {
        documentType: "DNI",
        documentNumber: random.toString(),
        names: randomFrom(FIRST_NAMES),
        lastName1: randomFrom(SURNAMES),
        lastName2: randomFrom(SURNAMES),
        birthDate: "04/02/2000",
        phone: "9" + Math.floor(Math.random() * 90000000 + 10000000),
        email: `test_${random}@mail.com`,
        colegio: "1570803",
        grado: "Grado 10 o 4to de secundaria",
        carrera: "INGENIERIA EMPRESARIAL",
        campus: "Lima Ate"
    };
    saveToTxt(data);
    return data;
}

function saveToTxt(data: UserData) {
    const filePath = path.join(process.cwd(), "test-data.txt");

    const content = `
    ==== Test Execution ====
    Documento: ${data.documentType} - ${data.documentNumber}
    Nombre: ${data.names} ${data.lastName1} ${data.lastName2}
    Nacimiento: ${data.birthDate}
    Celular: ${data.phone}
    Correo: ${data.email}
    Colegio: ${data.colegio}
    Grado: ${data.grado}
    Carrera: ${data.carrera}
    Campus: ${data.campus}
    -------------------------
    `;

    fs.appendFileSync(filePath, content);
}