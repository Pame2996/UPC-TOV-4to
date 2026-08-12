Add-Type -AssemblyName System.Windows.Forms

$result = [System.Windows.Forms.MessageBox]::Show(
    "¿Deseas borrar las capturas de pantalla del proyecto?" + [Environment]::NewLine + [Environment]::NewLine + "- test-result\screenshots\" + [Environment]::NewLine + "- screenshots\",
    "Limpieza de capturas - Playwright Colegios UPC",
    [System.Windows.Forms.MessageBoxButtons]::YesNo,
    [System.Windows.Forms.MessageBoxIcon]::Question
)

if ($result -eq [System.Windows.Forms.DialogResult]::Yes) {
    $projectRoot = "C:\Playwright - Colegios UPC"
    $folders = @(
        (Join-Path $projectRoot "test-result\screenshots"),
        (Join-Path $projectRoot "screenshots")
    )

    foreach ($folder in $folders) {
        if (Test-Path $folder) {
            Remove-Item -Path $folder -Recurse -Force
        }
    }

    [System.Windows.Forms.MessageBox]::Show(
        "Capturas borradas correctamente.",
        "Limpieza completada",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Information
    ) | Out-Null
}
