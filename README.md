# HelloBuild GitHub Repository Explorer

This application allows you to sign in with GitHub and explore your personal repositories, as well as save them as favorites.

## Features

- 🔐 GitHub Authentication
- 📚 Personal repository exploration
- 🔍 GitHub repository search
- ⭐ Favorite repository management
- 🔄 Storage of favorites in database (Firebase)
- 🎨 Modern and responsive user interface

## Technologies Used

- Next.js 15.3
- React 19
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS
- React Icons

## Prerequisites

- Node.js 18 or higher
- A GitHub account
- A Firebase account

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hellobuild-app.git
cd hellobuild-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with the GitHub provider
3. Enable Firestore Database
4. Get the configuration credentials for your web application

### 4. Configure GitHub OAuth

1. Create a new OAuth App in [GitHub Developer Settings](https://github.com/settings/developers)
2. The callback URL should be: `https://your-firebase-project-id.firebaseapp.com/__/auth/handler`
3. Get the Client ID and Client Secret

### 5. Create .env.local file

Create a `.env.local` file in the root of the project with the following information:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 6. Run the application in development

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 7. Build for production

```bash
npm run build
npm start
```

## Project Structure

- `/src/app` - Next.js application routes
- `/src/components` - Reusable components
- `/src/context` - React contexts (Auth, etc.)
- `/src/hooks` - Custom hooks
- `/src/lib` - Library configurations (Firebase, etc.)
- `/src/services` - Services for API communication
- `/src/types` - TypeScript definitions
- `/src/utils` - Utilities and helper functions
- `/public` - Static files

## License

MIT

---

Developed as part of the technical test for HelloBuild.
