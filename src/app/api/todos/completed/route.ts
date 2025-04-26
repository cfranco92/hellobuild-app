import { NextRequest, NextResponse } from 'next/server';
import * as dbUtils from '@/utils/db';


export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del usuario' },
        { status: 400 }
      );
    }
    
    const result = await dbUtils.deleteCompletedTodos(userId);
    
    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Error al eliminar todos completados:', error);
    return NextResponse.json(
      { error: 'Error al eliminar todos completados' },
      { status: 500 }
    );
  }
} 