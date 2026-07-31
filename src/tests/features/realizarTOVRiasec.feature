Feature: Realizar TOV

Scenario: Usuario realiza TOV
Given el usuario ha realizado el registro
When  se encuentra en el segundo bloque
And visualiza el test de Intereses
Then responde las 45 preguntas aleatorias
