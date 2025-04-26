import { NextRequest, NextResponse } from 'next/server';
import * as dbUtils from '@/utils/db';


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
    
    const favorites = await dbUtils.getFavoriteRepos(userId);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json(
      { error: 'Error getting favorites' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const { userId, repository } = await request.json();
    
    if (!userId || !repository) {
      return NextResponse.json(
        { error: 'User ID and repository information are required' },
        { status: 400 }
      );
    }
    
    const success = await dbUtils.addFavoriteRepo(userId, repository);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error adding favorite' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Error adding favorite' },
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
        { error: 'User ID and repository ID are required' },
        { status: 400 }
      );
    }
    
    const success = await dbUtils.removeFavoriteRepo(userId, repositoryId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error removing favorite' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Error removing favorite' },
      { status: 500 }
    );
  }
} 