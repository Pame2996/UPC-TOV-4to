Feature: Registro de usuario y flujo completo del TOV

@registromastov
Scenario Outline: El usuario se registra y completa el TOV - <grado>
Given el usuario ingresa a la página principal de UPC
When el usuario da clic en Registrarme
And el usuario selecciona el colegio con código "<colegio>"
And el usuario selecciona el grado "<grado>"
And el usuario da clic en Continuar
And el usuario selecciona la opción "<dondeEstasTuOpcion>" en la pantalla Dónde estás tú
And el usuario da clic en Continuar
And el usuario ingresa sus datos personales con tipo de documento "<tipoDocumento>"
And el usuario da clic en Continuar
And el usuario selecciona sus carreras de interés "<carrera1>" y "<carrera2>"
And el usuario selecciona dónde quiere estudiar "Lima"
And el usuario selecciona la modalidad de estudio "Presencial"
And el usuario omite la selección de universidad
And el usuario confirma su ruta
And el usuario selecciona lo que más valora de la universidad "Empleabilidad garantizada"
And el usuario selecciona cómo financiará sus estudios "Padre, madre o ambos"
And el usuario inicia la aventura de autoconocimiento
And el usuario responde las preguntas de autoconocimiento
And el usuario finaliza la sección de autoconocimiento
Then inicia el test de personalidad
And responde el test de Riasec
And responde el test de Vocare
And visualiza y valida los resultados de carreras

  @4to
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1               | carrera2               |
    | 0340414 | Grado 10 o 4to de secundaria | 1                   | DNI           | Ingeniería de Software | Administración         |

  @5to
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1               | carrera2               |
    | 0340414 | Grado 11 o 5to de secundaria | 1                   | DNI           | Medicina               | Enfermería             |

  @egresado
  Examples:
    | colegio | grado                  | dondeEstasTuOpcion | tipoDocumento | carrera1               | carrera2               |
    | 0340414 | Ya terminé el colegio  | 1                   | DNI           | Ingeniería de Software | Administración         |
