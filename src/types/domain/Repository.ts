export interface RepositoryApiResponse {
  id: string;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export class Repository {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public url: string,
    public language: string | null,
    public stars: number,
    public forks_count: number,
    public updated_at: string
  ) {}
  
  get formattedDate(): string {
    const date = new Date(this.updated_at);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  static fromApiResponse(data: RepositoryApiResponse): Repository {
    return new Repository(
      data.id,
      data.name,
      data.description || null,
      data.html_url,
      data.language || null,
      data.stargazers_count,
      data.forks_count,
      data.updated_at
    );
  }
} 