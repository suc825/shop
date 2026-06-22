@echo off
echo ========================================
echo 启动用户前台前端
echo ========================================
echo.
echo 用户前台地址: http://localhost:8082
echo.
echo 正在启动HTTP服务器...
echo 按 Ctrl+C 停止服务
echo.
python -m http.server 8082
pause
