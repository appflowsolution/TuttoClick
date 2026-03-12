@echo off
echo [TuttoClick] Actualizando datos desde Google Sheets...
call node fetch-data.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudieron actualizar los datos.
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] Datos actualizados correctamente en src/data/ofertas.json
pause
