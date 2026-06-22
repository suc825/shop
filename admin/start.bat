@echo off
echo ========================================
echo 启动管理后台前端
echo ========================================
echo.
echo 正在安装依赖...
call npm install
echo.
echo 正在启动开发服务器...
echo 管理后台地址: http://localhost:8081
echo.
echo 按 Ctrl+C 停止服务
echo.
call npm run serve
pause
