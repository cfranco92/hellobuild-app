import { NextRequest, NextResponse } from 'next/server';
import * as dbUtils from '@/utils/db';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    await dbUtils.deleteCompletedTodos(userId);
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    return NextResponse.json(
      { error: 'Error deleting completed todos' },
      { status: 500 }
    );
  }
} 