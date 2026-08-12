@echo off
echo Adding files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Update website content and layout"

echo.
echo Pushing to GitHub...
git push

echo.
echo ====================================
echo Done! Changes pushed to GitHub.
echo ====================================
pause
