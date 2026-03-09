// DTOs in SnippetVault.Application/DTOs/Snippets/

export interface SnippetResponse {
  id: string;
  title: string;
  description?: string;        
  codeBody: string;
  language: string;
  isPublic: boolean;
  username: string;            
  tags?: string[]; 
  createdAt: string; 
  updatedAt?: string;
}

export interface SnippetListResponse {
  items: SnippetResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateSnippetRequest {
  title: string;
  description?: string;
  codeBody: string;
  language: string;
  isPublic: boolean;
  tags: string[];
}

// UpdateSnippetRequest has the same shape as CreateSnippetRequest.
// Is define as a separate interface rather than reusing CreateSnippetRequest
// because they might diverge in a future version, and explicit is better than clever.
export interface UpdateSnippetRequest {
  title: string;
  description?: string;
  codeBody: string;
  language: string;
  isPublic: boolean;
  tags: string[];
}