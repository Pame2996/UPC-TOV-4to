import * as XLSX from "xlsx";

export type PreguntaOpcion = {
  pregunta: string;
  opcion: string; // "1" | "2" | "3" o texto
};

export function leerPreguntasConOpcion(params: {
  filePath: string;
  sheetName: string;
  colIDPregunta: string;
  colPregunta?: string;
  colOpcion?: string;
}): PreguntaOpcion[] {
  const colIDPregunta = params.colIDPregunta ?? "IDPregunta";
  const colPregunta = params.colPregunta ?? "Pregunta";
  const colOpcion = params.colOpcion ?? "Opcion";

  const wb = XLSX.readFile(params.filePath);
  const ws = wb.Sheets[params.sheetName];
  if (!ws) throw new Error(`No existe la hoja: ${params.sheetName}`);

  const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: "" });

  return json
    .map((r) => ({
      idpregunta: String(r[colIDPregunta] ?? "").trim(),
      pregunta: String(r[colPregunta] ?? "").trim(),
      opcion: String(r[colOpcion] ?? "").trim(),
    }))
    .filter((r) => r.idpregunta.length > 0 && r.pregunta.length > 0 && r.opcion.length > 0);
}

export function leerCarreras(params: {
  filePath: string;
  sheetName: string;
  colTitulo?: string;
}) {

  const colTitulo = params.colTitulo ?? "titulo";

  const wb = XLSX.readFile(params.filePath);
  const ws = wb.Sheets[params.sheetName];

  if (!ws) throw new Error(`No existe la hoja: ${params.sheetName}`);

  const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: "" });

  return json
    .map((r) => ({
      titulo: String(r[colTitulo] ?? "").trim(),
    }))
    .filter((r) => r.titulo.length > 0);
}