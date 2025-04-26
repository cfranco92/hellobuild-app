import { NextRequest, NextResponse } from 'next/server';
import * as dbUtils from '@/utils/db';


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { completed, text } = await request.json();
    
    if (completed === undefined && !text) {
      return NextResponse.json(
        { error: 'Se requiere al menos un campo para actualizar' },
        { status: 400 }
      );
    }
    
    const updates: { completed?: boolean; text?: string } = {};
    if (completed !== undefined) updates.completed = completed;
    if (text) updates.text = text;
    
    const updatedTodo = await dbUtils.updateTodo(id, updates);
    
    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Error al actualizar todo:', error);
    return NextResponse.json(
      { error: 'Error al actualizar todo' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await dbUtils.deleteTodo(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Todo no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error al eliminar todo:', error);
    return NextResponse.json(
      { error: 'Error al eliminar todo' },
      { status: 500 }
    );
  }
} 