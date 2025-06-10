@echo off
echo --- CI/CD käynnissä ---

echo 1. Tallennetaan GitHubiin...
git add .
git commit -m "CI/CD päivitys"
git push origin main

echo 2. Päivitetään Herokuun...
git push heroku main

echo --- Valmis ---
pause
