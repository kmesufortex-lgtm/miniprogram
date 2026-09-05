@echo off
setlocal
set "PORT=%~1"
if "%PORT%"=="" set "PORT=4188"
set "PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if not exist "%PYTHON%" (
  echo Python runtime not found.
  echo Please install Python or update PYTHON in start-admin.cmd.
  pause
  exit /b 1
)

echo Admin prototype: http://localhost:%PORT%/admin-web/
echo Press Ctrl+C to stop the server.
pushd "%~dp0"
"%PYTHON%" -m http.server %PORT% --directory "%~dp0"
popd
