import { NextRequest, NextResponse } from 'next/server';
import { GithubApiAdapter } from '@/services/api/GithubApiAdapter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const query = searchParams.get('query');
    const cursor = searchParams.get('cursor');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const adapter = new GithubApiAdapter();
    const results = await adapter.searchRepositories(query, token, cursor || undefined, limit);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching repositories:', error);
    return NextResponse.json(
      { error: 'Error searching repositories' },
      { status: 500 }
    );
  }
} 