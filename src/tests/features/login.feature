Feature: Usuario puede iniciar sesión

Scenario: Usuario inicia sesión
Given el usuario se encuentra en la página de inicio
When ingresa a la opcion Ya tengo cuenta
And ingresa el DNI
And ingresa el número de celular
And da clic en Continuar
Then inicia el test de personalidad
And responde el test de Riasec
And responde el test de Vocare
And visualiza y valida los resultados de carreras
