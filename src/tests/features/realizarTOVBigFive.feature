Feature: Realizar TOV

Scenario: Usuario realiza TOV
Given el usuario ha realizado el registro
When  da clic en Iniciar Test
And visualiza el test de BigFive
Then responde las 25 preguntas aleatorias
