# Script para compilar y desplegar en el subdirectorio /test/
# Autor: GitHub Copilot
# Fecha: Noviembre 2025

Write-Host "🚀 Compilando aplicación para subdirectorio /test/..." -ForegroundColor Green

# 1. Compilar la aplicación
Write-Host "📦 Compilando aplicación..." -ForegroundColor Yellow
ionic build --configuration=pruebas

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la compilación" -ForegroundColor Red
    exit 1
}

# 2. Modificar el base href en index.html
Write-Host "🔧 Modificando base href para subdirectorio..." -ForegroundColor Yellow
$indexPath = "www\index.html"
$content = Get-Content $indexPath -Raw
$newContent = $content -replace '<base href="/">', '<base href="/test/">'
Set-Content $indexPath $newContent

Write-Host "✅ Base href cambiado a /test/" -ForegroundColor Green

# 3. Copiar archivos al directorio test (opcional)
$testDir = "C:\xampp82\htdocs\unab\test"
if (Test-Path $testDir) {
    Write-Host "📁 Copiando archivos al directorio test..." -ForegroundColor Yellow
    Copy-Item -Path "www\*" -Destination $testDir -Recurse -Force
    Write-Host "✅ Archivos copiados a $testDir" -ForegroundColor Green
} else {
    Write-Host "⚠️  Directorio $testDir no existe. Crear manualmente si es necesario." -ForegroundColor Yellow
}

Write-Host "🎉 ¡Compilación para /test/ completada!" -ForegroundColor Green
Write-Host "📂 Archivos disponibles en: www\" -ForegroundColor Cyan
Write-Host "🌐 Base href configurado para: /test/" -ForegroundColor Cyan