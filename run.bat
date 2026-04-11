@echo off
echo ============================================
echo  MediCore - Starting Application
echo ============================================

echo Opened Application Successfully!


:: Use system-wide MYSQL_JAR env variable, fallback to user's known path if not set
if "%MYSQL_JAR%"=="" set MYSQL_JAR=D:\Apps\mysql-connector-j-9.6.0\mysql-connector-j-9.6.0.jar
set CLASSPATH_LIBS=out;%MYSQL_JAR%;lib\*

if not exist out\medicore\Main.class (
    echo ERROR: Project not compiled yet. Run compile.bat first!
    pause
    exit /b 1
)

java -cp "%CLASSPATH_LIBS%" medicore.Main
