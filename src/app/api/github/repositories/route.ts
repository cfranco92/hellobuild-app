import { NextRequest, NextResponse } from 'next/server';
import { GithubApiAdapter } from '@/services/api/GithubApiAdapter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    const cursor = searchParams.get('cursor');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }
    
    const adapter = new GithubApiAdapter();
    const repositories = await adapter.fetchUserRepositories(token, cursor || undefined, limit);
    
    return NextResponse.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Error fetching repositories' },
      { status: 500 }
    );
  }
} 