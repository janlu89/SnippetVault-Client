export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
  },
  snippets: {
    base: '/snippets',
    byId: (id: string) => `/snippets/${id}`,
    hardDelete: (id: string) => `/snippets/${id}/hard`,
    edit: (id: string) => `/snippets/${id}`,
  },
  tags: {
    base: '/tags',
  },
} as const;