import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, query, where } from 'firebase/firestore';

interface Repository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks_count: number;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const favoritesCollection = collection(db, 'users', userId, 'favorites');
    const snapshot = await getDocs(favoritesCollection);
    
    const repositories: Repository[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      repositories.push({
        id: data.id,
        name: data.name,
        description: data.description || null,
        url: data.url,
        language: data.language || null,
        stars: data.stars,
        forks_count: data.forks_count,
        updated_at: data.updated_at
      });
    });
    
    return NextResponse.json({ success: true, data: repositories });
  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Error loading favorite repositories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, repository } = body;
    
    if (!userId || !repository) {
      return NextResponse.json(
        { success: false, error: 'User ID and repository data are required' },
        { status: 400 }
      );
    }
    
    const favoritesCollection = collection(db, 'users', userId, 'favorites');
    await addDoc(favoritesCollection, {
      id: repository.id,
      name: repository.name,
      description: repository.description,
      url: repository.url,
      language: repository.language,
      stars: repository.stars,
      forks_count: repository.forks_count,
      updated_at: repository.updated_at,
      added_at: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Error adding to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const repositoryId = searchParams.get('repositoryId');
    
    if (!userId || !repositoryId) {
      return NextResponse.json(
        { success: false, error: 'User ID and repository ID are required' },
        { status: 400 }
      );
    }
    
    const favoritesCollection = collection(db, 'users', userId, 'favorites');
    const q = query(favoritesCollection, where('id', '==', repositoryId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    snapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'users', userId, 'favorites', document.id));
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Error removing from favorites' },
      { status: 500 }
    );
  }
} 