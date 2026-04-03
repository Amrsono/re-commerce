$ErrorActionPreference = "Stop"
$setupDir = "c:\Github repos\projects\Bob\recommerce-marketplace\.db"
if (!(Test-Path $setupDir)) {
    New-Item -ItemType Directory -Force -Path $setupDir | Out-Null
}
Set-Location $setupDir

Write-Host "Downloading Redis..."
Invoke-WebRequest -Uri "https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.zip" -OutFile "redis.zip"
Write-Host "Extracting Redis..."
Expand-Archive -Path "redis.zip" -DestinationPath "redis" -Force

Write-Host "Downloading PostgreSQL..."
Invoke-WebRequest -Uri "https://get.enterprisedb.com/postgresql/postgresql-14.5-1-windows-x64-binaries.zip" -OutFile "postgres.zip"
Write-Host "Extracting PostgreSQL..."
Expand-Archive -Path "postgres.zip" -DestinationPath "postgres" -Force

Write-Host "Initializing PostgreSQL data directory..."
Set-Location "postgres\pgsql\bin"
.\initdb.exe -D ..\data -U postgres -A trust

Write-Host "Starting Redis..."
Set-Location $setupDir
Start-Process -FilePath ".\redis\redis-server.exe" -WindowStyle Hidden

Write-Host "Starting PostgreSQL..."
Set-Location "$setupDir\postgres\pgsql\bin"
Start-Process -FilePath ".\pg_ctl.exe" -ArgumentList "-D ..\data -l ..\logfile start" -WindowStyle Hidden

Write-Host "Databases setup complete."
