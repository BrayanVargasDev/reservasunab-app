### Para instalación:
Usar node versión: **22 LTS**
Instalar el ionic cli:
```
npm install -g @ionic/cli
```
Luego instalar las dependencias estando ubicado en la raíz del proyecto:
```
npm install
```
1. Para lanzar en modo desarrollo conectandose a los diferentes entornos
Pruebas: `pruebas`
Producción: `production`
Local: `local`
```
ionic serve -c=comando
```

2. Para compilar la aplicación con los diferentes comandos:
Pruebas: `pruebas`
Producción: `production`
```
ionic build -c=comando
```

3. Siempre se debe sincronizar capacitor luego de compilar para que copie los assets:
```
npx cap sync
```

4. Para abrir los AndroidStudio (android) o XCode (ios) se usa:
```
npx cap open android o ios
```
