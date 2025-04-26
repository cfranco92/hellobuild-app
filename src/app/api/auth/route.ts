import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from 'firebase/auth';


export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Se requiere correo y contraseña' },
        { status: 400 }
      );
    }
    
    let result: UserCredential;
    
    if (action === 'signup') {
      
      result = await createUserWithEmailAndPassword(auth, email, password);
    } else if (action === 'login') {
      
      result = await signInWithEmailAndPassword(auth, email, password);
    } else {
      return NextResponse.json(
        { error: 'Acción no válida' },
        { status: 400 }
      );
    }
    
    
    return NextResponse.json({
      user: {
        uid: result.user.uid,
        email: result.user.email
      }
    });
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    let errorMessage = 'Error durante la autenticación';
    let statusCode = 500;
    
    
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firebaseError = error as { code: string };
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está registrado';
        statusCode = 400;
      } else if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        errorMessage = 'Credenciales incorrectas';
        statusCode = 401;
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil';
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}


export async function GET() {
  try {
    await signOut(auth);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
} 