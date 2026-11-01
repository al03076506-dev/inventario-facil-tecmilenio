# Documentación técnica — Inventario Fácil

## 1. Descripción
Aplicación full stack para gestionar productos de un inventario. Incluye registro e inicio de sesión, listado público, alta, edición y eliminación de productos. Se diseñó como avance académico.

## 2. Tecnologías
- **Frontend:** HTML5, CSS3, JavaScript (DOM y Fetch API).
- **Backend:** Node.js, Express.js, REST API.
- **Persistencia:** MongoDB + Mongoose.
- **Seguridad:** bcryptjs para hash de contraseñas; JWT Bearer para acciones de escritura; dotenv para secretos.
- **Herramientas:** Git, VS Code y Postman.

## 3. Arquitectura
- `backend/server.js`: carga configuración e inicia servidor tras conectarse a MongoDB.
- `backend/app.js`: middleware, rutas y archivos estáticos.
- `backend/config/`: conexión a BD.
- `backend/models/`: esquemas de Usuario y Producto.
- `backend/controllers/`: lógica de autenticación y CRUD.
- `backend/routes/`: definición de endpoints REST.
- `backend/middleware/`: verificación de JWT, errores y manejo de promesas.
- `frontend/`: vistas, estilos y lógica del navegador.

## 4. Modelo de datos
**User:** name (texto), email (único), passwordHash (hash bcrypt), createdAt, updatedAt.
**Product:** name, description, price (≥ 0), stock (entero ≥ 0), category, owner (referencia al usuario creador), createdAt, updatedAt.

## 5. Endpoints
| Método | Ruta | Auth | Cuerpo o resultado |
|---|---|---|---|
| GET | `/api/health` | No | `{ "status": "ok" }` |
| POST | `/api/auth/register` | No | `{ "name": "Ana", "email": "ana@example.com", "password": "EjemploSeguro123" }` |
| POST | `/api/auth/login` | No | `{ "email": "ana@example.com", "password": "EjemploSeguro123" }` |
| GET | `/api/products` | No | Array de productos (hasta 200, ordenados recientes primero) |
| GET | `/api/products/:id` | No | Producto por identificador |
| POST | `/api/products` | Sí | `{ "name": "Teclado", "description": "Mecánico", "price": 799.99, "stock": 12, "category": "Tecnología" }` |
| PUT | `/api/products/:id` | Sí, propietario | Objeto completo del producto con los mismos campos |
| DELETE | `/api/products/:id` | Sí, propietario | Mensaje de confirmación |

**Autorización:** enviar cabecera `Authorization: Bearer <TOKEN>`. Los usuarios solo pueden editar o eliminar sus propios productos; las lecturas son públicas.

**Respuestas frecuentes:** `200` OK, `201` creado, `400` validación, `401` sin autenticar, `404` no encontrado/no autorizado para ese recurso, `409` correo duplicado, `500` error inesperado.

## 6. Variables de entorno y uso de IA
Se solicitó a una herramienta de IA un ejemplo de variables `.env` con `dotenv`. Se adaptó usando `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV` y un `CORS_ORIGIN` opcional. Los secretos reales se guardan en `.env` (excluido de Git) y se entrega únicamente `.env.example`. La clave JWT debe ser larga y aleatoria. Se validó en el código su presencia y longitud antes del arranque.

## 7. Criterios UI/UX y sugerencias de IA
Se usó IA como apoyo para proponer un inicio de sesión con tarjeta central, campos etiquetados, contraste adecuado, mensajes de error visibles, diseño adaptable a móviles, botones claros y jerarquía tipográfica. Las sugerencias se adaptaron a un diseño sobrio con formulario accesible y feedback textual; toda interacción se realiza mediante JavaScript y Fetch.

## 8. Cómo ejecutar y probar
Revisar `README.md`. Instalar MongoDB local, copiar `.env.example` a `.env`, definir una clave JWT y ejecutar `npm install` / `npm run dev`. Abrir `http://localhost:3000`. En Postman, registrar usuario, iniciar sesión, copiar token, crear producto, consultarlo, editarlo y eliminarlo. La colección Postman está en `postman/`.

## 9. Despliegue preliminar
**Local:** `http://localhost:3000` después de iniciar el servidor; no es una URL pública.
**Nube:** Render requiere conectar tu repositorio y una instancia de MongoDB accesible (p. ej., MongoDB Atlas). Configurar las variables sensibles en el panel del servicio y publicar con `npm start`. La URL real se agregará después del despliegue (no se inventa ni se incluye una URL ficticia).

## 10. Restricciones y mejoras futuras
Esta es una versión preliminar académica; no incluye recuperación de contraseñas, paginación completa, pruebas de integración contra MongoDB real ni políticas antibrutefuerza. Para producción conviene usar HTTPS, rate limiting, logging estructurado, sanitización avanzada, pruebas de integración y gestión de tokens más robusta.
