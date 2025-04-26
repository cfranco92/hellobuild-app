# HelloBuild App

Una aplicación para gestionar tareas (ToDo) y ver repositorios de GitHub, desarrollada con Next.js y Firebase.

## Características

- Autenticación de usuarios mediante Firebase Authentication
- Almacenamiento de tareas en Firestore
- Gestión de tareas: añadir, marcar como completadas, eliminar
- Visualización de repositorios de GitHub
- Interfaz responsiva con Tailwind CSS

## Requisitos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Firebase
- (Opcional) Cuenta de GitHub para la integración con la API de GitHub

## Configuración

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/hellobuild-app.git
cd hellobuild-app
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Configura Firebase:
   - Crea un nuevo proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita la autenticación por correo/contraseña
   - Crea una base de datos en Firestore
   - Obtén las credenciales de configuración

4. Configura las variables de entorno:
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Añade las siguientes variables con los valores de tu proyecto de Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

5. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura de la base de datos

La aplicación utiliza Firestore con la siguiente estructura:

- **Colección `todos`**:
  - `id`: ID único del documento (generado por Firestore)
  - `userId`: ID del usuario propietario de la tarea
  - `text`: Texto de la tarea
  - `completed`: Estado de la tarea (completada o no)
  - `createdAt`: Fecha de creación
  - `updatedAt`: Fecha de última actualización

## Rutas API

La aplicación utiliza rutas API de Next.js para interactuar con Firebase desde el backend:

- `POST /api/auth`: Autenticación de usuarios (login/signup)
- `GET /api/auth`: Cierre de sesión
- `GET /api/todos`: Obtener todas las tareas del usuario
- `POST /api/todos`: Crear una nueva tarea
- `PUT /api/todos/[id]`: Actualizar una tarea
- `DELETE /api/todos/[id]`: Eliminar una tarea
- `DELETE /api/todos/completed`: Eliminar todas las tareas completadas

## Despliegue

Para desplegar la aplicación a producción:

```bash
npm run build
npm run start
# o
yarn build
yarn start
```

También puedes desplegar fácilmente en Vercel o Netlify.
