$path = Split-Path $MyInvocation.MyCommand.Path -Parent
$updatedPath = ($path -replace "\\[^\\]*(?:\\)?$")
Set-Location "$($updatedPath)/solutions"

& "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\amd64\MSBuild.exe" /t:build /restore