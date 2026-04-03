$ErrorActionPreference = "Stop"
Set-Location "c:\Github repos\projects\Bob\recommerce-marketplace\.db"

Write-Host "Extracting Postgres using tar..."
tar.exe -xf postgres.zip -C postgres

Write-Host "Initializing DB..."
Set-Location "postgres\pgsql\bin"
.\initdb.exe -D ..\data -U postgres -A trust

Write-Host "Starting Postgres..."
Set-Location "c:\Github repos\projects\Bob\recommerce-marketplace\.db"
Start-Process -FilePath ".\postgres\pgsql\bin\pg_ctl.exe" -ArgumentList "-D .\postgres\pgsql\data -l .\postgres\logfile start" -WindowStyle Hidden

Write-Host "Starting Redis..."
Start-Process -FilePath ".\redis\redis-server.exe" -WindowStyle Hidden

Write-Host "Done"
