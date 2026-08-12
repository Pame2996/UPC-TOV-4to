Feature: Registro de ficha física

@fichafisica
Scenario Outline: El usuario registra una ficha física - <grado>
Given el usuario ingresa a la página de registro de ficha física
When el usuario completa los datos principales con colegio "<colegio>", grado "<grado>" y tipo de documento "<tipoDocumento>"
And el usuario completa los datos del apoderado
And el usuario selecciona la carrera de preferencia "<carrera>"
And el usuario acepta el tratamiento de datos personales
And el usuario da clic en Registrar y guardar
Then se muestra el mensaje de registro exitoso

  @4to
  Examples:
    | colegio | grado                        | tipoDocumento | carrera                |
    | 0340414 | Grado 10 o 4to de secundaria | DNI           | Ingeniería de Software |

  @5to
  Examples:
    | colegio | grado                        | tipoDocumento | carrera       |
    | 0340414 | Grado 11 o 5to de secundaria | DNI           | Administración |
