export interface FirebaseUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class User {
  constructor(
    public uid: string,
    public email: string | null,
    public displayName: string | null = null,
    public photoURL: string | null = null,
    public githubToken: string | null = null
  ) {}
  
  get hasGithubToken(): boolean {
    return !!this.githubToken;
  }
  
  get name(): string {
    return this.displayName || 'GitHub User';
  }
  
  static fromFirebaseUser(firebaseUser: FirebaseUserData, githubToken?: string | null): User {
    return new User(
      firebaseUser.uid,
      firebaseUser.email,
      firebaseUser.displayName,
      firebaseUser.photoURL,
      githubToken
    );
  }
} 