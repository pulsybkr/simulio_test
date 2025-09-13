@echo off
REM Script de lancement pour Simulio (Windows)

echo 🚀 Démarrage de Simulio...

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

REM Vérifier si Docker Compose est installé
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

REM Lancer les services
echo 🐳 Démarrage des conteneurs Docker...
docker-compose up -d

REM Attendre quelques secondes que les services démarrent
echo ⏳ Démarrage des services en cours...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 Simulio est maintenant opérationnel !
echo.
echo 📱 Application : http://localhost:8080
echo 🔧 API Backend : http://localhost:3333
echo 🧮 API Simulation : http://localhost:8000
echo 🗄️ phpMyAdmin : http://localhost:8081
echo.
echo 💡 Premier utilisateur admin :
echo    Email: admin@simulio.com
echo    Mot de passe: Admin123!
echo.
echo 📖 Consultez le README.md pour plus d'informations
echo.
pause
