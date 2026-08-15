# Elvira Nursery — Tienda en línea

Sitio para publicar tu catálogo, mostrar inventario en vivo, recibir órdenes y cobrar con tarjeta.

## Qué incluye

- **Catálogo público** (`/`) con búsqueda y filtro por categoría, fotos, precio y existencia.
- **Carrito y pago** (`/carrito`) — el cliente llena sus datos y paga con Stripe.
- **Panel de administrador** (`/admin`):
  - `/admin/productos` — agregar, editar, eliminar productos; subir/cambiar foto de cada uno; importar tu hoja completa por CSV.
  - `/admin/ordenes` — ver órdenes de clientes y cambiar su estado (pagada, preparando, entregada, etc.)

## 1. Crear el proyecto de Firebase

Puedes usar el **mismo proyecto de Firebase de Control de Vivero** o crear uno nuevo si prefieres mantener la tienda separada de tu app interna.

1. https://console.firebase.google.com → Crear proyecto (o abrir el existente).
2. Activa **Firestore Database** (modo producción).
3. Activa **Storage** (para las fotos de las plantas).
4. Activa **Authentication → Email/Password**, y crea tu usuario administrador (tu correo y una contraseña) — con ese entras a `/admin`.
5. En **Project settings → General**, agrega una "Web app" y copia las claves (`apiKey`, `authDomain`, etc.) — las necesitas en el paso 3.
6. Sube las reglas incluidas:
   - `firestore.rules` → Firestore Database → Reglas
   - `storage.rules` → Storage → Reglas

## 2. Crear cuenta de Stripe

1. https://dashboard.stripe.com/register — crea tu cuenta (puedes empezar en modo prueba).
2. En **Developers → API keys**, copia la **Secret key** (`sk_...`).
3. Más adelante, en **Developers → Webhooks**, agregarás un endpoint apuntando a:
   `https://TU-SITIO.netlify.app/.netlify/functions/stripe-webhook`
   Selecciona el evento `checkout.session.completed` y copia el **Signing secret** (`whsec_...`).
4. Cuando quieras cobrar de verdad (no solo pruebas), activa tu cuenta con tus datos bancarios en Stripe.

## 3. Configurar variables de entorno en Netlify

En tu sitio de Netlify → **Site configuration → Environment variables**, agrega (ver `.env.example`):

- Las 6 variables `VITE_FIREBASE_...` (de Firebase, paso 1.5)
- `STRIPE_SECRET_KEY` (de Stripe, paso 2.2)
- `STRIPE_WEBHOOK_SECRET` (de Stripe, paso 2.3, una vez creado el webhook)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — de una llave de servicio: Firebase → **Project settings → Service accounts → Generate new private key**. Copia `project_id`, `client_email` y `private_key` del archivo descargado (la llave privada llévala tal cual, con los `\n` incluidos).

## 4. Desplegar en Netlify

**Importante:** a diferencia de Control de Vivero, este sitio usa **funciones de servidor** (para hablar con Stripe de forma segura), así que **no se puede desplegar arrastrando la carpeta `dist`** — Netlify necesita instalar dependencias y construir las funciones. Dos formas de hacerlo:

- **Opción recomendada — conectar a GitHub:** sube esta carpeta a un repositorio de GitHub y conéctalo en Netlify (`Add new site → Import from Git`). Cada cambio que subas se despliega solo.
- **Opción rápida — Netlify CLI:** desde esta carpeta, en tu computadora:
  ```
  npm install -g netlify-cli
  netlify login
  netlify deploy --prod
  ```

## 5. Cargar tu inventario inicial

Ya preparé tus ~150 productos (extraídos de las hojas que enviaste) en `src/data/seedProducts.js`, con nombre, tamaño, precio y existencia. Los que en tu hoja decían "Paid" quedaron sin precio — edítalos en `/admin/productos` con el precio real de venta.

Para cargarlos todos de una vez a Firestore:
1. `npm install`
2. Descarga tu llave de servicio (paso 3) y guárdala como `serviceAccountKey.json` en esta carpeta (no se sube a git).
3. `node scripts/seed.js`

Si prefieres no correr el script, también puedes exportar `seedProducts.js` a CSV y usar el importador de `/admin/productos`.

## 6. Agregar las fotos

Entra a `/admin/productos`, y junto a cada planta pulsa **"Subir foto"**. Puedes cambiarla cuando quieras — cada vez que subas una nueva, reemplaza la anterior en el catálogo público al instante.

## Notas

- El inventario y precios que ves en el catálogo público se actualizan en tiempo real — cualquier cambio que hagas en `/admin/productos` se refleja de inmediato.
- Cuando un cliente paga, el webhook de Stripe descuenta automáticamente la existencia de cada producto comprado.
- Puedes cambiar el estado de una orden (pendiente, pagada, preparando, entregada) desde `/admin/ordenes` para llevar control de las entregas.
