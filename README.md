# Inventario Fácil — Proyecto Full Stack (Tecmilenio)

Sistema web de gestión de inventarios desarrollado como proyecto académico para Tecmilenio. Permite registrar usuarios, iniciar sesión, consultar productos y administrar un inventario mediante operaciones CRUD.

La aplicación integra un frontend desarrollado con **React y Vite**, un backend con **Node.js y Express**, una base de datos **MongoDB**, autenticación mediante **JWT** y una API externa para convertir valores monetarios de pesos mexicanos (MXN) a dólares estadounidenses (USD).

## Aplicación publicada

**Aplicación web:**  
https://inventario-facil-tecmilenio.onrender.com

**Repositorio GitHub:**  
https://github.com/al03076506-dev/inventario-facil-tecmilenio

**Rama de entrega:** `entrega-final`

## Tecnologías utilizadas

| Componente | Tecnología |
|---|---|
| Frontend | React, Vite, JavaScript, HTML y CSS |
| Navegación | React Router |
| Backend | Node.js y Express.js |
| Base de datos | MongoDB y Mongoose |
| Autenticación | JSON Web Tokens (JWT) |
| Seguridad de contraseñas | bcryptjs |
| API externa | Frankfurter |
| Pruebas automatizadas | Node.js Test Runner |
| Pruebas de API | Postman |
| Control de versiones | Git y GitHub |
| Despliegue | Render |

## Funcionalidades principales

### Autenticación y usuarios

- Registro de nuevos usuarios.
- Inicio de sesión mediante correo electrónico y contraseña.
- Autenticación con JWT.
- Contraseñas protegidas mediante hash.
- Cierre de sesión.
- Control de acceso basado en roles de usuario.

### Gestión de productos

- Consultar el inventario.
- Registrar nuevos productos.
- Consultar información individual de productos.
- Actualizar productos existentes.
- Eliminar productos.
- Buscar productos por nombre o categoría.
- Consultar resultados paginados.
- Validar información ingresada en los formularios.

### Roles y permisos

El sistema contempla dos roles principales:

**Administrador (`admin`)**: puede consultar, crear, actualizar y eliminar productos.

**Usuario regular (`user`)**: puede consultar productos, pero no está autorizado para realizar operaciones de creación, actualización o eliminación.

Las operaciones administrativas se encuentran protegidas mediante middleware de autenticación y autorización.

### Conversión de monedas

El sistema incorpora una integración con la API externa Frankfurter para consultar el tipo de cambio MXN/USD.

El panel de control muestra:

- Cantidad total de productos.
- Valor total del inventario en pesos mexicanos.
- Valor equivalente en dólares estadounidenses.
- Tipo de cambio utilizado.
- Fecha del tipo de cambio.

La conversión se realiza mediante el endpoint:

`GET /api/currency/convert?amount=3500`

## Arquitectura del proyecto

La aplicación utiliza una arquitectura cliente-servidor:

1. React presenta la interfaz y gestiona la interacción con el usuario.
2. Express expone endpoints REST.
3. Los controladores procesan las solicitudes.
4. Los middleware validan autenticación y permisos.
5. Mongoose permite trabajar con MongoDB.
6. La API de Frankfurter proporciona información sobre el tipo de cambio.
7. Render aloja la aplicación y sirve la compilación de React mediante Express.

## Estructura de carpetas

```text
gestion-productos-tecmilenio/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── frontend-react/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── frontend/
├── tests/
│   └── app.test.js
├── postman/
├── docs/
├── evidencias/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

La carpeta `frontend/` conserva la implementación original en HTML, CSS y JavaScript, mientras que `frontend-react/` contiene la nueva interfaz desarrollada con React.

## Requisitos

- Node.js 20 o superior.
- npm.
- MongoDB Community Server o MongoDB Atlas.
- Git.
- Visual Studio Code (recomendado).
- Postman (recomendado).

## Instalación local

Clonar el repositorio:

```bash
git clone https://github.com/al03076506-dev/inventario-facil-tecmilenio.git

cd inventario-facil-tecmilenio

git checkout entrega-final
```

Instalar las dependencias del backend:

```bash
npm install
```

Crear el archivo de variables de entorno:

```bash
cp .env.example .env
```

Configurar las variables necesarias en `.env`, utilizando los nombres definidos en `.env.example`.

Por ejemplo:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gestion_productos
JWT_SECRET=REEMPLAZAR_CON_UNA_CLAVE_SEGURA
JWT_EXPIRES_IN=1d
PORT=3000
NODE_ENV=development
```

Nunca publicar contraseñas, cadenas de conexión privadas ni claves JWT en el repositorio.

## Ejecutar la aplicación

### Backend

Desde la carpeta principal:

```bash
npm run dev
```

### Frontend React en desarrollo

En una segunda terminal:

```bash
cd frontend-react
npm install
npm run dev
```

Vite mostrará la dirección local disponible, normalmente `http://localhost:5173`.

Para el funcionamiento integrado en un solo servidor, se debe compilar React.

Desde la carpeta principal:

```bash
npm run build
npm start
```

Después abrir:

`http://localhost:3000/login`

## Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos |
| GET | `/api/products/:id` | Consultar producto |
| POST | `/api/products` | Crear producto — administrador |
| PUT | `/api/products/:id` | Actualizar producto — administrador |
| DELETE | `/api/products/:id` | Eliminar producto — administrador |

### Otras rutas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/health` | Consultar estado del servidor |
| GET | `/api/currency/convert?amount=3500` | Convertir MXN a USD |

### Filtros y paginación

La API permite realizar consultas con parámetros como:

```http
GET /api/products?page=1&limit=5
GET /api/products?category=Electrónica
GET /api/products?name=Samsung
```

La paginación valida que la página sea mayor que cero y que el límite se encuentre dentro del rango permitido.

### Autorización

Las operaciones administrativas requieren un encabezado:

```http
Authorization: Bearer TOKEN_JWT
```

La API utiliza códigos HTTP como:

- `200 OK`: solicitud exitosa.
- `400 Bad Request`: parámetros inválidos.
- `401 Unauthorized`: falta de autenticación o token inválido.
- `403 Forbidden`: usuario sin permisos suficientes.

## Pruebas automatizadas

El proyecto utiliza el sistema de pruebas integrado de Node.js.

Ejecutar:

```bash
npm test
```

Se implementaron nueve pruebas automatizadas:

| # | Prueba | Resultado |
|---|---|---|
| 1 | Estado del servidor `/api/health` | Aprobada |
| 2 | Creación sin JWT | Aprobada |
| 3 | Actualización sin JWT | Aprobada |
| 4 | Rechazo de JWT inválido | Aprobada |
| 5 | Rechazo de JWT expirado | Aprobada |
| 6 | Restricción para usuario regular | Aprobada |
| 7 | Validación de paginación | Aprobada |
| 8 | Rechazo de cantidades negativas | Aprobada |
| 9 | Conversión MXN/USD con respuesta simulada | Aprobada |

**Resultado de la ejecución local del 2 de noviembre de 2026:**

- Pruebas ejecutadas: 9.
- Pruebas exitosas: 9.
- Pruebas fallidas: 0.

Las pruebas utilizan simulaciones para determinados escenarios de autenticación y conversión, por lo que no sustituyen las pruebas de integración completas con la base de datos real.

## Despliegue en Render

La aplicación está alojada en Render y utiliza MongoDB para persistir los datos.

**Configuración de despliegue:**

| Campo | Valor |
|---|---|
| Servicio | Web Service |
| Entorno | Node.js |
| Rama | `entrega-final` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check | `/api/health` |

Variables de entorno principales:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
NODE_ENV
```

El puerto de ejecución se obtiene de la variable `PORT` proporcionada por el entorno de alojamiento.

La aplicación utiliza Express para servir los archivos compilados de React.

**URL del despliegue:**

https://inventario-facil-tecmilenio.onrender.com

## Evidencias del proyecto

Las evidencias de funcionamiento pueden almacenarse en la carpeta `evidencias/`.

Entre las evidencias de la entrega se incluyen:

- Formulario de registro.
- Pantalla de inicio de sesión.
- Dashboard de inventario.
- Visualización del valor del inventario en MXN y USD.
- Formulario de edición de productos.
- Pruebas de endpoints mediante Postman.
- Ejecución de pruebas automatizadas.
- Repositorio publicado en GitHub.
- Aplicación desplegada en Render.

## Seguridad

El sistema implementa autenticación mediante JWT, validación de tokens, protección de contraseñas mediante bcryptjs y autorización por roles.

Para esta demostración académica se utiliza `sessionStorage` para conservar el token de sesión.

Las operaciones administrativas requieren permisos específicos del lado del servidor.

No deben compartirse contraseñas, tokens, cadenas de conexión privadas ni archivos `.env`.

Para un entorno productivo de mayor alcance se recomienda incorporar cookies HttpOnly y Secure, controles adicionales de seguridad, monitoreo y políticas de acceso más estrictas.

## Documentación complementaria

La documentación técnica detallada se encuentra en:

`docs/DOCUMENTACION_TECNICA.md`

El material de apoyo para el video se encuentra en la carpeta `docs/`.

## Estado del proyecto

El sistema cuenta con frontend React, backend Express, base de datos MongoDB, autenticación JWT, administración de productos, conversión de monedas, pruebas automatizadas y despliegue público.

Las pruebas automatizadas principales fueron aprobadas y se verificó visualmente el panel de inventario y la apertura del formulario de edición en el despliegue.

**Proyecto académico desarrollado para Tecmilenio — 2026.**