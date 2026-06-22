@echo off
echo ========================================
echo 启动后端服务
echo ========================================
echo.
echo 正在启动Spring Boot后端服务...
echo 后端服务地址: http://localhost:8080/ShopOnline
echo.
echo 按 Ctrl+C 停止服务
echo.
mvn spring-boot:run
pause
