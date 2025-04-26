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
        console.log('Firebase Analytics inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar Firebase Analytics:', error);
      }
    };
    
    setupAnalytics();
  }, []);

  return <>{children}</>;
} 