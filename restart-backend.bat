@echo off
REM Reiniciar o servidor FastAPI corretamente
echo ------------------------------------------
echo Matando processos Python anteriores...
echo ------------------------------------------

REM Matar todos os python.exe
taskkill /F /IM python.exe >nul 2>&1

timeout /t 2 /nobreak

echo.
echo ------------------------------------------
echo Iniciando novo servidor FastAPI...
echo ------------------------------------------
echo.

cd /d C:\project\APMS
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001 --reload

REM Manter a janela aberta se houver erro
if errorlevel 1 (
    echo.
    echo Erro ao iniciar! Pressione uma tecla...
    pause
)
