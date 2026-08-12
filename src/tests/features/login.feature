Feature: Usuario puede iniciar sesión

@login
Scenario Outline: Usuario inicia sesión - <seccion>
Given el usuario se encuentra en la página de inicio
When ingresa a la opcion Ya tengo cuenta
And ingresa el DNI "<dni>" de la seccion "<seccion>" con tipo de documento "<tipoDocumento>"
And ingresa el número de celular
And da clic en Continuar
Then inicia el test de personalidad
And responde el test de Riasec
And responde el test de Vocare
And visualiza y valida los resultados de carreras

  @4to
  Examples:
    | seccion | dni      | tipoDocumento |
    | 4to     | 09082601 | Pasaporte     |

  @5to
  Examples:
    | seccion | dni        | tipoDocumento |
    | 5to     | 0210082611 | Pasaporte     |
