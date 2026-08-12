Feature: Realizar registro de usuario

@registro
Scenario Outline: El usuario completa el registro de datos personales - <grado>
Given el usuario ingresa a la página principal de UPC
When el usuario da clic en Registrarme
And el usuario selecciona el colegio con código "<colegio>"
And el usuario selecciona el grado "<grado>"
And el usuario da clic en Continuar
And el usuario selecciona la opción "<dondeEstasTuOpcion>" en la pantalla Dónde estás tú
And el usuario da clic en Continuar
And el usuario ingresa sus datos personales con tipo de documento "<tipoDocumento>"
And el usuario da clic en Continuar
Then se completa el registro y avanza a la siguiente pantalla

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
