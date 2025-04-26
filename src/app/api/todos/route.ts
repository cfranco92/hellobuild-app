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
    
    const todos = await dbUtils.getTodos(userId);
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error getting todos:', error);
    return NextResponse.json(
      { error: 'Error getting todos' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const { userId, text } = await request.json();
    
    if (!userId || !text) {
      return NextResponse.json(
        { error: 'User ID and text are required' },
        { status: 400 }
      );
    }
    
    const newTodo = await dbUtils.addTodo(userId, text);
    
    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Error creating todo' },
      { status: 500 }
    );
  }
} 