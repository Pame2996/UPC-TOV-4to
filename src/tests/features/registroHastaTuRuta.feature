Feature: Registro de usuario hasta antes de Tu Ruta

@registrohastaturuta
Scenario Outline: El usuario se registra hasta antes de la pantalla Tu Ruta - <grado>
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
# Estas dos pantallas solo aparecen en 5to/egresado; en 4to el paso se salta solo.
And el usuario selecciona lo que más valora de la universidad "Empleabilidad garantizada"
And el usuario selecciona cómo financiará sus estudios "Padre, madre o ambos"

  @4to
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1                          | carrera2                          |
    | 0340414 | Grado 10 o 4to de secundaria | 1                  | DNI           | Ingeniería de Software            | Administración                    |

  @egresado
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1                          | carrera2                          |
    | 0340414 | Ya terminé el colegio        | 1                  | DNI           | Ciencias Políticas                | Ciencias Políticas                |

  @5todni
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1                          | carrera2                          |
    | 0340414 | Grado 11 o 5to de secundaria | 1                  | DNI           | Biología                          | Artes escénicas                   |

  @5topasaporte
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1                          | carrera2                          |
    | 0340414 | Grado 11 o 5to de secundaria | 1                  | Pasaporte     | Psicología                        | Administración y Recursos Humanos |

  @5tocarnet
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1                          | carrera2                          |
    | 0340414 | Grado 11 o 5to de secundaria | 1                  | Carnet        | Enfermería                        | Medicina                          |

  @5topasaporte2
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1                          | carrera2                          |
    | 0340414 | Grado 11 o 5to de secundaria | 1                  | Pasaporte     | Administración y Recursos Humanos | Psicología                        |

  @5tomedicina
  Examples:
    | colegio | grado                        | dondeEstasTuOpcion | tipoDocumento | carrera1                          | carrera2                          |
    | 0340414 | Grado 11 o 5to de secundaria | 1                  | DNI           | Medicina                          | Medicina                          |
