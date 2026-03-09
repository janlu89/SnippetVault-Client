// These interfaces mirror your .NET DTOs exactly.
// SnippetVault.Application/DTOs/

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// This mirrors AuthResponse.cs in your Application layer exactly.
// Note that 'expiration' is a string here rather than DateTime
export interface AuthResponse {
  token: string;
  username: string;
  userId: string;
  expiration: string;
}