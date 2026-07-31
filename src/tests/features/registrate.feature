Feature: Realizar registro de usuario
@happypath
Scenario: Realizar registro de usuario
Given el usuario ingresa a la página principal de UPN
When el usuario da clic en Regístrate
And el usuario ingresa sus datos personales
And el usuario da clic en Continuar
Then se muestra pantalla de TOV