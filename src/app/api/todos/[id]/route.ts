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
        { error: 'At least one field is required for update' },
        { status: 400 }
      );
    }
    
    const updates: { completed?: boolean; text?: string } = {};
    if (completed !== undefined) updates.completed = completed;
    if (text) updates.text = text;
    
    const updatedTodo = await dbUtils.updateTodo(id, updates);
    
    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Error updating todo' },
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
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Error deleting todo' },
      { status: 500 }
    );
  }
} 