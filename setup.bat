@echo off
title Inventory Genie Enterprise Setup

echo.
echo ======================================================
echo    🚀 Inventory Genie Enterprise - Windows Setup
echo ======================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm found: 
npm --version
echo.

REM Install server dependencies
echo ℹ️  Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)
echo ✅ Server dependencies installed successfully
echo.

REM Install client dependencies
echo ℹ️  Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
echo ✅ Client dependencies installed successfully
echo.

REM Go back to root directory
cd ..

REM Check and create environment files
echo ℹ️  Checking environment configuration...

if not exist "server\.env" (
    if exist "server\.env.example" (
        copy "server\.env.example" "server\.env" >nul
        echo ✅ Created server\.env from template
        echo ⚠️  Please update server\.env with your MongoDB URI and settings
    ) else (
        echo ⚠️  server\.env.example not found. Please create server\.env manually
    )
) else (
    echo ✅ server\.env already exists
)

if not exist "client\.env" (
    if exist "client\.env.example" (
        copy "client\.env.example" "client\.env" >nul
        echo ✅ Created client\.env from template
    ) else (
        echo ⚠️  client\.env.example not found. Please create client\.env manually
    )
) else (
    echo ✅ client\.env already exists
)

echo.

REM Ask about database seeding
set /p seed="🌱 Do you want to seed the database with sample data? (y/N): "
if /i "%seed%"=="y" (
    echo ℹ️  Seeding database...
    cd server
    call npm run seed
    if %errorlevel% equ 0 (
        echo ✅ Database seeded successfully
        echo.
        echo 🔐 Default login credentials:
        echo    Admin: admin@inventory-genie.com / Admin@123
        echo    Manager: manager@inventory-genie.com / Manager@123
        echo    Employee: employee@inventory-genie.com / Employee@123
    ) else (
        echo ⚠️  Database seeding failed. You can run 'npm run seed' later.
    )
    cd ..
)

REM Create Windows start script
echo ℹ️  Creating development start script...
(
echo @echo off
echo title Inventory Genie Enterprise - Development
echo echo 🚀 Starting Inventory Genie Enterprise in development mode...
echo echo.
echo echo Starting server on port 5000...
echo start "Server" cmd /k "cd /d server && npm run dev"
echo echo.
echo echo Starting client on port 3000...
echo timeout /t 3 /nobreak ^>nul
echo start "Client" cmd /k "cd /d client && npm start"
echo echo.
echo echo ✅ Development servers are starting...
echo echo 🌐 Frontend: http://localhost:3000
echo echo 🌐 Backend: http://localhost:5000/api/v1
echo echo 🌐 API Docs: http://localhost:5000/api/docs
echo echo.
echo pause
) > start-dev.bat

echo ✅ Development script created (start-dev.bat)
echo.

REM Final message
echo ======================================================
echo                🎉 Setup Complete!
echo ======================================================
echo.
echo ✅ All dependencies installed
echo ✅ Environment files configured  
echo ✅ Development scripts created
echo.
echo 📚 Available commands:
echo    start-dev.bat      - Start development servers
echo    .\setup.sh         - Run bash setup (if using Git Bash)
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000/api/v1
echo    API Docs: http://localhost:5000/api/docs
echo.
echo 📖 Next steps:
echo    1. Update server\.env with your MongoDB URI and settings
echo    2. Run 'start-dev.bat' to start development servers
echo    3. Access the application at http://localhost:3000
echo.
echo ✅ Happy coding! 🚀
echo.
pause