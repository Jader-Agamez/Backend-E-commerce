# 🛠️ Backend — E-Commerce API

API REST construida con **Node.js**, **Express** y **SQLite** (vía Sequelize).

---

## 📁 Estructura

```
backend/
├── src/
│   ├── app.js                  # Entrada principal, middlewares y arranque
│   ├── config/
│   │   ├── database.js         # Conexión Sequelize → SQLite
│   │   ├── swagger.js          # Configuración OpenAPI 3.0
│   │   ├── seed.js             # Datos iniciales
│   │   └── init.sql            # Script SQL de referencia
│   ├── models/
│   │   ├── index.js            # Asociaciones entre modelos
│   │   ├── User.js             # Usuarios (admin / customer)
│   │   ├── Category.js         # Categorías de productos
│   │   ├── Product.js          # Productos con stock
│   │   ├── Order.js            # Pedidos
│   │   ├── OrderItem.js        # Detalle de pedido
│   │   └── Cart.js             # Carrito persistente
│   ├── controllers/
│   │   ├── authController.js   # Registro, login, perfil
│   │   ├── productController.js# CRUD + búsqueda y filtros
│   │   ├── categoryController.js
│   │   ├── cartController.js   # Agregar, actualizar, eliminar items
│   │   ├── orderController.js  # Crear pedido, pago, inventario
│   │   └── userController.js   # Gestión de usuarios (admin)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js             # Verificación JWT + roles
│   │   ├── errorHandler.js     # Manejo centralizado de errores
│   │   └── validate.js         # express-validator helper
│   ├── services/
│   │   ├── emailService.js     # Nodemailer (bienvenida + confirmación)
│   │   ├── pdfService.js       # Generación de facturas con PDFKit
│   │   └── paymentService.js   # Pasarela de pago simulada
│   └── jobs/
│       └── cartCleanup.js      # Cron: limpieza de carritos abandonados
├── database.sqlite             # Base de datos SQLite (archivo local)
├── invoices/                   # Facturas PDF generadas
├── .env                        # Variables de entorno
├── Dockerfile
└── package.json
```

---

## ⚙️ Instalación

```bash
cd backend
npm install
```

### Variables de entorno (`.env`)

```env
NODE_ENV=development
PORT=5000

# Base de datos (SQLite — no requiere servidor)
# El archivo se crea automáticamente en backend/database.sqlite

# JWT
JWT_SECRET=supersecretjwtkey2024
JWT_EXPIRES_IN=7d

# Email — obtener credenciales en https://ethereal.email
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=tu_usuario@ethereal.email
EMAIL_PASS=tu_password
EMAIL_FROM=noreply@ecommerce.com

FRONTEND_URL=http://localhost:3000
```

---

## 🚀 Comandos

| Comando | Descripción |
|---------|-------------|
| `npm start` | Producción |
| `npm run dev` | Desarrollo con nodemon |
| `npm run seed` | Crear tablas y cargar datos iniciales |

### Primera ejecución

```bash
npm run seed   # Crea las tablas y carga datos de prueba
npm start      # Arranca el servidor en http://localhost:5000
```

---

## 🗄️ Base de datos

Usa **SQLite** — no requiere instalar ningún servidor. El archivo `database.sqlite` se genera automáticamente en la carpeta `backend/`.

### Modelos y relaciones

```
users ──────────< orders ──────────< order_items >────── products
                                                              │
categories ─────────────────────────────────────────────────<┘
                                                              │
users ──────────< carts >─────────────────────────────────────┘
```

| Modelo | Tabla | Relaciones |
|--------|-------|------------|
| User | `users` | hasMany Orders, hasMany Carts |
| Category | `categories` | hasMany Products |
| Product | `products` | belongsTo Category, hasMany OrderItems, hasMany Carts |
| Order | `orders` | belongsTo User, hasMany OrderItems |
| OrderItem | `order_items` | belongsTo Order, belongsTo Product |
| Cart | `carts` | belongsTo User, belongsTo Product |

---

## 🔌 Endpoints

### Auth — `/api/auth`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/register` | ❌ | Registro de usuario |
| POST | `/login` | ❌ | Login → devuelve JWT |
| GET | `/profile` | ✅ | Ver perfil propio |
| PUT | `/profile` | ✅ | Actualizar nombre, teléfono, dirección |

### Productos — `/api/products`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | ❌ | Listar con filtros: `search`, `categoryId`, `minPrice`, `maxPrice`, `page`, `limit` |
| GET | `/:id` | ❌ | Detalle de producto |
| POST | `/` | 🔐 admin | Crear producto |
| PUT | `/:id` | 🔐 admin | Actualizar producto |
| DELETE | `/:id` | 🔐 admin | Soft delete (isActive = false) |

### Categorías — `/api/categories`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | ❌ | Listar categorías activas |
| GET | `/:id` | ❌ | Categoría con sus productos |
| POST | `/` | 🔐 admin | Crear |
| PUT | `/:id` | 🔐 admin | Actualizar |
| DELETE | `/:id` | 🔐 admin | Soft delete |

### Carrito — `/api/cart`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | ✅ | Ver carrito del usuario |
| POST | `/` | ✅ | Agregar item `{ productId, quantity }` |
| PUT | `/:id` | ✅ | Actualizar cantidad |
| DELETE | `/clear` | ✅ | Vaciar carrito completo |
| DELETE | `/:id` | ✅ | Eliminar un item |

### Pedidos — `/api/orders`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | ✅ | Crear pedido + procesar pago + actualizar stock |
| GET | `/my` | ✅ | Mis pedidos |
| GET | `/:id` | ✅ | Detalle de pedido |
| GET | `/` | 🔐 admin | Todos los pedidos (con filtro `status`) |
| PUT | `/:id/status` | 🔐 admin | Cambiar estado del pedido |

### Usuarios — `/api/users`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | 🔐 admin | Listar todos los usuarios |
| GET | `/:id` | 🔐 admin | Ver usuario |
| PUT | `/:id` | 🔐 admin | Editar usuario / cambiar rol |
| DELETE | `/:id` | 🔐 admin | Desactivar usuario |

### Otros

| Ruta | Descripción |
|------|-------------|
| `GET /api/health` | Estado del servidor |
| `GET /api/docs` | Documentación Swagger UI |
| `GET /invoices/:archivo.pdf` | Descargar factura PDF |

---

## 🔐 Autenticación

JWT en header `Authorization: Bearer <token>`.

- Token expira en **7 días** (configurable en `.env`)
- Roles: `admin` y `customer`
- Passwords hasheados con **bcryptjs** (salt 10)

---

## 📧 Emails automáticos

Se envían de forma asíncrona (no bloquean la respuesta):

| Evento | Email |
|--------|-------|
| Registro de usuario | Bienvenida |
| Pedido confirmado | Confirmación con tabla de productos y total |

Para ver los emails en desarrollo, accede a **https://ethereal.email** con las credenciales del `.env`.

---

## 📄 Facturas PDF

Al confirmar un pedido se genera automáticamente un PDF en `backend/invoices/invoice-{id}.pdf` con:
- Datos del cliente
- Tabla de productos, cantidades y precios
- Total del pedido

Descargable desde: `http://localhost:5000/invoices/invoice-{id}.pdf`

---

## 💳 Pasarela de pago simulada

| Número de tarjeta | Resultado |
|-------------------|-----------|
| Cualquier número válido | ✅ Aprobado — genera `PAY-XXXXXXXX` |
| `4000000000000002` | ❌ Rechazado |

En producción reemplazar `paymentService.js` con Stripe, PayPal o MercadoPago.

---

## ⏰ Cron Jobs

| Tarea | Horario | Descripción |
|-------|---------|-------------|
| Limpieza de carritos | Diario a medianoche (`0 0 * * *`) | Elimina carritos no actualizados en más de 7 días |

---

## 🛡️ Seguridad

- **Helmet** — headers HTTP seguros
- **CORS** — configurable por origen
- **Rate limiting** — 200 requests / 15 minutos por IP
- **express-validator** — validación de inputs en todas las rutas
- **Manejo centralizado de errores** — `errorHandler.js`

---

## 📦 Dependencias principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| express | ^4.18.2 | Framework HTTP |
| sequelize | ^6.35.2 | ORM |
| sqlite3 | ^6.0.1 | Base de datos |
| jsonwebtoken | ^9.0.2 | Autenticación JWT |
| bcryptjs | ^2.4.3 | Hash de contraseñas |
| nodemailer | ^6.9.7 | Envío de emails |
| pdfkit | ^0.14.0 | Generación de PDFs |
| node-cron | ^3.0.3 | Tareas programadas |
| swagger-ui-express | ^5.0.0 | Documentación API |
| helmet | ^7.1.0 | Seguridad HTTP |
| express-rate-limit | ^7.1.5 | Rate limiting |
