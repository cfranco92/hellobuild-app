'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <Header />
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3 text-lg flex-shrink-0" />
            <div>
              <h2 className="text-lg font-medium text-blue-800 mb-2">Registro no disponible</h2>
              <p className="text-blue-700 mb-3">
                Esta aplicación solo permite iniciar sesión con GitHub. 
                No es necesario registrarse con correo electrónico y contraseña.
              </p>
              <p className="text-sm text-blue-600">
                Serás redirigido a la página de inicio de sesión automáticamente en unos segundos.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={goToLogin}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            <FaArrowLeft className="mr-2" />
            Volver a inicio de sesión
          </button>
        </div>
        
        <Footer />
      </div>
    </main>
  );
} 