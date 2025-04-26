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
        { error: 'Email and password are required' },
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
        { error: 'Invalid action' },
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
    console.error('Authentication error:', error);
    
    let errorMessage = 'Authentication error';
    let statusCode = 500;
    
    
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firebaseError = error as { code: string };
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
        statusCode = 400;
      } else if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        errorMessage = 'Invalid credentials';
        statusCode = 401;
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
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
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Error during logout' },
      { status: 500 }
    );
  }
} 