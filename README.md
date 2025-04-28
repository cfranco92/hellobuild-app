# GitHub Repository Explorer

A modern web application that allows users to sign in with GitHub, explore their repositories, search for public repositories and save favorites. Built with Next.js, React, Firebase and the GitHub GraphQL API.

**Live Demo:** [https://hellobuild-app-interview.vercel.app/](https://hellobuild-app-interview.vercel.app/)

![GitHub Repository Explorer](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)

## 🚀 Features

- **GitHub Authentication** - Secure login with GitHub OAuth
- **Repository Exploration** - View your GitHub repositories
- **Repository Search** - Search for public repositories on GitHub
- **Favorites Management** - Save and manage your favorite repositories
- **Responsive Design** - Modern UI that works on desktop and mobile devices
- **Dark Mode Support** - Built-in theme support for dark mode

## 🛠️ Technologies

- **Next.js 15.3** - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Firebase**
  - Authentication with GitHub provider
  - Firestore database for favorites storage
- **Tailwind CSS** - Utility-first CSS framework
- **GitHub GraphQL API** - Data fetching for repositories

## 📋 Prerequisites

- Node.js 18.x or higher
- GitHub account
- Firebase account

## 🔧 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/github-repository-explorer.git
cd github-repository-explorer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a new project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with GitHub provider
3. Set up Firestore Database
4. Get your Firebase configuration values

### 4. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) and create a new OAuth App
2. Set the authorization callback URL to your Firebase auth domain: `https://your-project-id.firebaseapp.com/__/auth/handler`
3. Note your Client ID and Client Secret

### 5. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 6. Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 7. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

The project follows a clean architecture approach:

```
/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router pages
│   ├── auth/          # Authentication utilities
│   ├── components/    # Reusable React components
│   │   ├── auth/      # Authentication related components
│   │   ├── github/    # GitHub repository related components
│   │   └── layout/    # Layout components (header, footer, etc.)
│   ├── context/       # React context providers for global state
│   ├── firebase/      # Firebase configuration and services
│   ├── hooks/         # Custom React hooks for shared logic
│   ├── lib/           # Library configurations 
│   ├── services/      # API services for external interactions
│   ├── types/         # TypeScript definitions
│   └── utils/         # Utility functions
├── .env.local         # Environment variables (create this)
├── next.config.mjs    # Next.js configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## 🏗️ Architecture

This application follows a clean architecture approach with these key principles:

1. **Separation of Concerns**: Each directory has a specific responsibility:
   - `components`: UI elements with minimal business logic
   - `hooks`: Reusable logic that can be shared between components
   - `context`: Global state management
   - `services`: External API interactions
   - `utils`: Helper functions and utilities

2. **Dependency Direction**:
   - UI components depend on hooks and contexts
   - Hooks depend on services
   - Services interact with external APIs
   - This creates a clean flow of dependencies and makes testing easier

3. **Domain-Driven Organization**:
   - Components are organized by domain (auth, github, layout)
   - This makes the codebase more maintainable as it scales

## 🔒 Authentication Flow

1. User clicks "Sign in with GitHub" button
2. Firebase Authentication opens a popup for GitHub login
3. After successful authentication, a GitHub token is stored securely
4. The token is used for API requests to GitHub's GraphQL API

## 📱 Features in Detail

### Repository Exploration
- View your GitHub repositories sorted by last updated
- See key repository information including language, stars, and forks
- Click on a repository to open it on GitHub

### Repository Search
- Search for public repositories on GitHub
- Results include repository details from the GitHub API

### Favorites Management
- Add/remove repositories to your favorites list
- Favorites are saved to Firebase Firestore
- Easy toggle between all repositories and favorites

### Private Favorites vs. GitHub Stars
Unlike GitHub's native "starring" functionality, our favorites system has several advantages:
- **Private to you**: Your favorites don't affect the repository's star count and are not visible to others
- **Stored in the cloud**: Your favorites are stored in Firebase Firestore and linked to your account
- **Available across devices**: Access your favorites from any device you log in from
- **Independent of GitHub**: You can favorite repositories without interacting with GitHub's star API
- **No public footprint**: Your activity is not visible on your GitHub profile's activity feed

This approach gives you a personal way to bookmark repositories without the social aspects of GitHub's starring system.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgements

- GitHub for their excellent GraphQL API
- Firebase for authentication and database services
- Next.js and React teams for their fantastic frameworks

---

Developed as part of a technical challenge for HelloBuild.
