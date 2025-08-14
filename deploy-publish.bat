@echo off
REM 1. Excluir node_modules e package-lock.json, se existirem
if exist node_modules (
    echo Excluindo node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Excluindo package-lock.json...
    del /f /q package-lock.json
)

REM 2. Executar comandos do Git
echo Fazendo commit e push...
git add .
git commit -m "Update Version"
git push

REM 3. Executar ng build, se der erro, roda npm i --force e tenta de novo
echo Rodando ng build...
ng build
if errorlevel 1 (
    echo ng build falhou, rodando npm i --force...
    npm i --force
    echo Tentando ng build novamente...
    ng build
    if errorlevel 1 (
        echo ng build falhou novamente. Abortando script.
        exit /b 1
    )
)

REM 4. Pega o nome da pasta atual
for %%I in ("%cd%") do set "CUR_DIR=%%~nxI"
echo Nome do diretório: %CUR_DIR%

REM 5. Sobe 2 níveis e entra na pasta dist\NOME_DIRETORIO
cd ..
cd ..
cd dist\%CUR_DIR%

REM 6. Publica no NPM
echo Publicando no NPM...
npm publish --access public

pause
