'use client';

import React, { useEffect } from 'react';
import { initAnalytics } from './firebase';

export function FirebaseAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const setupAnalytics = async () => {
      try {
        await initAnalytics();
        console.log('Firebase Analytics initialized successfully');
      } catch (error) {
        console.error('Error initializing Firebase Analytics:', error);
      }
    };
    
    setupAnalytics();
  }, []);

  return <>{children}</>;
} 