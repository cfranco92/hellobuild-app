import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { FirebaseAnalyticsProvider } from '@/lib/firebase-analytics';
import { Navbar } from '@/components/layout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GitHub Repository Explorer',
  description: 'Explore your GitHub repositories and save your favorites',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`} suppressHydrationWarning={true}>
        <AuthProvider>
          <FirebaseAnalyticsProvider>
            <Navbar />
            <main className="container mx-auto py-4 px-4">
              {children}
            </main>
          </FirebaseAnalyticsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
