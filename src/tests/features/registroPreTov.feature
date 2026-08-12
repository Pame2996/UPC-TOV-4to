Feature: Registro de usuario hasta antes del TOV

@registropretov
Scenario Outline: El usuario se registra y llega hasta antes del TOV - <grado>
Given el usuario ingresa a la página principal de UPC
When el usuario da clic en Registrarme
And el usuario selecciona el colegio con código "<colegio>"
And el usuario selecciona el grado "<grado>"
And el usuario da clic en Continuar
And el usuario selecciona la opción "<dondeEstasTuOpcion>" en la pantalla Dónde estás tú
And el usuario da clic en Continuar
And el usuario ingresa sus datos personales con tipo de documento "<tipoDocumento>"
And el usuario da clic en Continuar
And el usuario selecciona sus carreras de interés "Ingeniería de Software" y "Administración"
And el usuario selecciona dónde quiere estudiar "Lima"
And el usuario selecciona la modalidad de estudio "Presencial"
And el usuario omite la selección de universidad
And el usuario confirma su ruta
And el usuario selecciona lo que más valora de la universidad "Empleabilidad garantizada"
And el usuario selecciona cómo financiará sus estudios "Padre, madre o ambos"
And el usuario inicia la aventura de autoconocimiento
And el usuario responde las preguntas de autoconocimiento
And el usuario finaliza la sección de autoconocimiento
Then se muestra la pantalla de inicio del test vocacional

  @4to
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento |
    | 0340414 | Grado 10 o 4to de secundaria | 1                   | DNI           |

  @5to
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento |
    | 0340414 | Grado 11 o 5to de secundaria | 1                   | DNI           |

  @egresado
  Examples:
    | colegio | grado                  | dondeEstasTuOpcion | tipoDocumento |
    | 0340414 | Ya terminé el colegio  | 1                   | DNI           |
