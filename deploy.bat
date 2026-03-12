@echo off
echo [TuttoClick] Iniciando proceso de despliegue local a produccion...

echo [1/3] Sincronizando datos desde Google Sheets...
call node fetch-data.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al sincronizar datos. Despliegue cancelado.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] Compilando aplicacion (Vite)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo en la compilacion. Despliegue cancelado.
    pause
    exit /b %ERRORLEVEL%
)

echo [3/3] Subiendo a Firebase Hosting...
call npx firebase deploy --only hosting --project tuttoclick
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo en el despliegue a Firebase.
    pause
    exit /b %ERRORLEVEL%
)

echo [OK] ¡Despliegue completado con exito!
echo Tu sitio esta vivo en: https://tuttoclick.web.app
pause
