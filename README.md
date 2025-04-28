# HelloBuild GitHub Repository Explorer

Esta aplicación permite iniciar sesión con GitHub y explorar tus repositorios personales, además de poder guardarlos como favoritos.

## Características

- 🔐 Autenticación con GitHub
- 📚 Exploración de repositorios personales
- 🔍 Búsqueda de repositorios en GitHub
- ⭐ Gestión de repositorios favoritos
- 🔄 Almacenamiento de favoritos en base de datos (Firebase)
- 🎨 Interfaz de usuario moderna y responsive

## Tecnologías utilizadas

- Next.js 15.3
- React 19
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS
- React Icons

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de GitHub
- Una cuenta de Firebase

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/hellobuild-app.git
cd hellobuild-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication con el proveedor de GitHub
3. Habilita Firestore Database
4. Obtén las credenciales de configuración de tu aplicación web

### 4. Configurar GitHub OAuth

1. Crea una nueva OAuth App en [GitHub Developer Settings](https://github.com/settings/developers)
2. La URL de callback debe ser: `https://tu-firebase-project-id.firebaseapp.com/__/auth/handler`
3. Obtén el Client ID y Client Secret

### 5. Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con la siguiente información:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu-measurement-id

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=tu-github-client-id
GITHUB_CLIENT_SECRET=tu-github-client-secret
```

### 6. Ejecutar la aplicación en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 7. Construir para producción

```bash
npm run build
npm start
```

## Estructura del proyecto

- `/src/app` - Rutas de la aplicación Next.js
- `/src/components` - Componentes reutilizables
- `/src/context` - Contextos de React (Auth, etc.)
- `/src/hooks` - Hooks personalizados
- `/src/lib` - Configuración de librerías (Firebase, etc.)
- `/src/services` - Servicios para comunicación con APIs
- `/src/types` - Definiciones de TypeScript
- `/src/utils` - Utilidades y funciones auxiliares
- `/public` - Archivos estáticos

## Licencia

MIT

---

Desarrollado como parte de la prueba técnica para HelloBuild.
