# GitHub Repository Explorer

A modern web application that allows users to sign in with GitHub, explore their repositories, search for public repositories and save favorites. Built with Next.js, React, Firebase and the GitHub GraphQL API.

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

```
/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router pages
│   ├── auth/          # Authentication utilities
│   ├── components/    # Reusable React components
│   ├── context/       # React context providers
│   ├── firebase/      # Firebase configuration
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Library configurations
│   ├── services/      # API services
│   ├── types/         # TypeScript definitions
│   └── utils/         # Utility functions
├── .env.local         # Environment variables (create this)
├── next.config.js     # Next.js configuration
└── tailwind.config.js # Tailwind CSS configuration
```

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

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- GitHub for their excellent GraphQL API
- Firebase for authentication and database services
- Next.js and React teams for their fantastic frameworks

---

Developed as part of a technical challenge for HelloBuild.
