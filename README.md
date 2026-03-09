# SnippetVault Client

An Angular 21 frontend for SnippetVault — a personal code snippet library with syntax highlighting, tag management, and JWT authentication.

## 🔗 Live
**Application:** https://janlu89.github.io/SnippetVault-Client/

## 🔗 Related Repositories
- [SnippetVault-API](https://github.com/janlu89/SnippetVault-API) — .NET 10 backend
- [SnippetVault-Infra](https://github.com/janlu89/SnippetVault-Infra) — Docker Compose orchestration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 |
| Language | TypeScript (strict mode) |
| UI Components | Angular Material |
| State Management | Angular Signals |
| Forms | Reactive Forms |
| Syntax Highlighting | ngx-highlightjs + highlight.js |
| Styling | SCSS with custom Material theme |
| Change Detection | Zoneless |
| Deployment | GitHub Pages via angular-cli-ghpages |
| CI/CD | GitHub Actions |

---

## Features

- **JWT Authentication** — register, login, persistent session via localStorage
- **Smart Route Guards** — redirects authenticated users away from login/register
- **Snippet List** — search by title/description, filter by language, pagination
- **Syntax Highlighting** — highlight.js github-dark theme across all languages
- **Snippet Detail** — full code display with ownership-aware edit/delete controls
- **Create & Edit Forms** — tag autocomplete, public/private toggle, language selector
- **Confirmation Dialogs** — Material dialog for destructive actions
- **Global Notifications** — snackbar feedback for all success and error states
- **Responsive Layout** — mobile and desktop breakpoints
- **Centralised Routing** — `API_ROUTES` and `APP_ROUTES` constants prevent magic strings

---

## Running Locally

**Prerequisites:** Node 22+

```bash
git clone https://github.com/janlu89/SnippetVault-Client.git
cd SnippetVault-Client/client
npm install
ng serve
```

The app will be available at `http://localhost:4200`

By default the app points to the production API at `https://snippetvault-api.onrender.com/api`. To point to a local API instead, update `src/environments/environments.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### With Docker Compose (runs full stack including API and database)
See [SnippetVault-Infra](https://github.com/janlu89/SnippetVault-Infra) for the full stack setup.

---

## Project Structure

```
src/
├── app/
│   ├── constants/        → API_ROUTES and APP_ROUTES
│   ├── guards/           → auth, guest, redirect guards
│   ├── interceptors/     → JWT auth interceptor
│   ├── models/           → TypeScript interfaces
│   ├── pages/            → login, register, snippet-list, snippet-detail, snippet-form
│   ├── services/         → auth, snippet, tag, notification, title services
│   └── shared/           → confirm-dialog component
├── environments/         → dev and prod environment configs
└── styles.scss           → global styles and Material theme
```

---

## CI/CD

GitHub Actions automatically builds and deploys to GitHub Pages on every push to `master`.
