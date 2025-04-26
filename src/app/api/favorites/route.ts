import { NextRequest, NextResponse } from 'next/server';
import * as dbUtils from '@/utils/db';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del usuario' },
        { status: 400 }
      );
    }
    
    const favorites = await dbUtils.getFavoriteRepos(userId);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return NextResponse.json(
      { error: 'Error al obtener favoritos' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const { userId, repository } = await request.json();
    
    if (!userId || !repository) {
      return NextResponse.json(
        { error: 'Se requiere el ID del usuario y la información del repositorio' },
        { status: 400 }
      );
    }
    
    const success = await dbUtils.addFavoriteRepo(userId, repository);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error al añadir favorito' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al añadir favorito:', error);
    return NextResponse.json(
      { error: 'Error al añadir favorito' },
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
        { error: 'Se requieren el ID del usuario y el ID del repositorio' },
        { status: 400 }
      );
    }
    
    const success = await dbUtils.removeFavoriteRepo(userId, repositoryId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error al eliminar favorito' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    return NextResponse.json(
      { error: 'Error al eliminar favorito' },
      { status: 500 }
    );
  }
} 