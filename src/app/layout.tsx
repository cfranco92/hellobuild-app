import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { FirebaseAnalyticsProvider } from '@/lib/firebase-analytics';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App - HelloBuild Interview",
  description: "A simple todo application built with Next.js",
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
            {children}
          </FirebaseAnalyticsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
