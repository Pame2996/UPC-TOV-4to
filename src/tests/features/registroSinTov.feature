Feature: Egresado que no realiza el TOV - el flujo termina en Tu ruta

@registrosintov
Scenario Outline: El egresado se registra, no realiza el TOV y en Tu ruta no ve la card Conócete - opción <dondeEstasTuOpcion>
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
And el usuario llega a Tu ruta seleccionando lo que valora "Empleabilidad garantizada" y el financiamiento "Padre, madre o ambos"
Then en Tu ruta no se muestra la card de Conócete

  # Las opciones se numeran en el orden en que se ven en pantalla; la 1 ("Todavía no estoy seguro...") sí hace TOV
  @egresadonotov1
  Examples:
    | colegio | grado                 | dondeEstasTuOpcion | tipoDocumento |
    | 0340414 | Ya terminé el colegio | 2                  | DNI           |

  @egresadonotov2
  Examples:
    | colegio | grado                 | dondeEstasTuOpcion | tipoDocumento |
    | 0340414 | Ya terminé el colegio | 3                  | DNI           |

  @egresadonotov3
  Examples:
    | colegio | grado                 | dondeEstasTuOpcion | tipoDocumento |
    | 0340414 | Ya terminé el colegio | 4                  | DNI           |

  @egresadonotov4
  Examples:
    | colegio | grado                 | dondeEstasTuOpcion | tipoDocumento |
    | 0340414 | Ya terminé el colegio | 5                  | DNI           |
