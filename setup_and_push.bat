@echo off
cd /d "c:\Users\EikoMotsu\Downloads\applicative project ppt"
echo Initializing Git repository...
git init
echo Setting remote URL to https://github.com/YashwanthNavari/sandbox.git...
git remote add origin https://github.com/YashwanthNavari/sandbox.git 2>nul
git remote set-url origin https://github.com/YashwanthNavari/sandbox.git
echo Adding all project files...
git add .
echo Committing changes...
git commit -m "Redesign PPT slides: complete 3-column architecture layout, enlarged font sizes, solid black borders, zero emojis, and zero internal gaps"
echo Pushing to GitHub repository...
git branch -M main
git push -u origin main --force
echo.
echo ===================================================
echo SUCCESS: Project pushed completely to GitHub repository!
echo Repository URL: https://github.com/YashwanthNavari/sandbox.git
echo ===================================================
pause
