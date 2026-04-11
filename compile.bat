@echo off
echo ============================================
echo  MediCore - Compiling Java Sources
echo ============================================

:: Use system-wide MYSQL_JAR env variable, fallback to user's known path if not set
if "%MYSQL_JAR%"=="" set MYSQL_JAR=D:\Apps\mysql-connector-j-9.6.0\mysql-connector-j-9.6.0.jar

set CLASSPATH_LIBS=%MYSQL_JAR%;lib\*
echo Using Classpath: %CLASSPATH_LIBS%

:: Collect all .java files
if not exist out mkdir out

:: Use a temp file list
dir /s /b src\*.java > sources.txt

javac -cp "%CLASSPATH_LIBS%" -d out @sources.txt

if %ERRORLEVEL% == 0 (
    echo.
    echo ** SUCCESS ** Compilation complete! Run run.bat to launch MediCore.
) else (
    echo.
    echo ** FAILED ** Check errors above.
)

del sources.txt
pause
