@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "ROJA DRINK" http://127.0.0.1:8765
  py -3 server.py
  goto selesai
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "ROJA DRINK" http://127.0.0.1:8765
  python server.py
  goto selesai
)
echo Python belum terpasang.
echo Pasang Python 3 dari https://www.python.org/downloads/ lalu centang Add Python to PATH.
pause
:selesai
