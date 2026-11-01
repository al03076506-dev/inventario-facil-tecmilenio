# Inventario Fácil — Proyecto Full Stack (Tecmilenio)

Aplicación de inventario con **Node.js + Express.js + MongoDB** y frontend en **HTML, CSS y JavaScript**. Incluye **JWT**, hash de contraseñas y **CRUD** de productos.

## Requisitos
- Node.js 20 o superior y npm.
- MongoDB Community Server **corriendo en tu equipo**, o MongoDB Atlas.
- Visual Studio Code y Postman (recomendados).

## Instalación local
```bash
npm install
cp .env.example .env
```
En Windows, si `cp` no funciona, usa `copy .env.example .env`.

Edita `.env` y establece una clave JWT segura. Puedes generar una con:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Asegúrate de que `MONGODB_URI` apunte a un MongoDB disponible. Para MongoDB local, usa `mongodb://127.0.0.1:27017/gestion_productos`. Si utilizas Atlas, sustituye la URI, habilita el acceso de red apropiado y **nunca subas credenciales a Git**.

Inicia la app:
```bash
npm run dev
```
Abre **http://localhost:3000**. Para modo normal utiliza `npm start`.

> No abras `frontend/index.html` mediante `file://`. El backend sirve el frontend desde el mismo puerto 3000.

## Demostración paso a paso
1. Abre el registro en `/register.html` y crea tu cuenta.
2. Inicia sesión o entra directamente al panel después de registrarte.
3. Pulsa **Nuevo producto** y guarda un producto con nombre, categoría, precio y existencias.
4. Usa el buscador y los botones **Editar** y **Eliminar**.
5. Haz pruebas de API con Postman usando `postman/Inventario_Facil.postman_collection.json`.

## Pruebas automatizadas
```bash
npm test
```
Estas son pruebas ligeras del endpoint de salud y de las restricciones de autenticación; necesitan las dependencias instaladas pero **no** una BD conectada. La demostración CRUD completa requiere MongoDB ejecutándose.

## Endpoints
Consulta la tabla y ejemplos en [docs/DOCUMENTACION_TECNICA.md](docs/DOCUMENTACION_TECNICA.md).

## GitHub
```bash
git init
git add .
git commit -m "Avance del reto: aplicación full stack de inventario"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```
Primero crea un repositorio vacío en GitHub y sustituye los marcadores de posición. Confirma que **`.env` y `node_modules` no se suben**.

## Render (opcional)
1. Sube el proyecto a GitHub.
2. Crea una base de datos en MongoDB Atlas (o usa otra base MongoDB accesible desde Render).
3. Render: **New > Web Service**, conecta el repositorio.
4. Build command: `npm install`; Start command: `npm start`.
5. Variables de entorno: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`. Render suministra `PORT` automáticamente.
6. Abre la URL real asignada y prueba la aplicación. Guárdala en el reporte y muéstrala en el video.

> Este ZIP no implica que la nube, GitHub o MongoDB de tu equipo hayan sido configurados o desplegados; esos pasos requieren tus cuentas y credenciales.

## Evidencias para entregar
- Código fuente de backend y frontend (este ZIP y repositorio GitHub).
- Documentación técnica (`docs/DOCUMENTACION_TECNICA.md`).
- Capturas de pantalla de login, panel y pruebas de Postman.
- Video explicativo grabado por ti (guion en `docs/GUIÓN_VIDEO.md`).
- URL real de GitHub y URL real del despliegue una vez publicados.

## Seguridad
El token JWT se almacena en `sessionStorage` para esta demostración académica: se borra al cerrar la pestaña. No deben publicarse contraseñas, tokens reales ni archivos `.env`. Para un entorno productivo se recomienda sesión basada en cookies HttpOnly/Secure, HTTPS y protección adicional.
