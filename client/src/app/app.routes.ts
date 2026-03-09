import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { redirectGuard } from './guards/redirect.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectGuard],
    loadComponent: () => import('./pages/snippet-list/snippet-list')
      .then(m => m.SnippetList)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },

  // Public content — no guard, anyone can browse snippets
  {
    path: 'snippets',
    loadComponent: () => import('./pages/snippet-list/snippet-list')
      .then(m => m.SnippetList)
  },

  // IMPORTANT: static routes must come before dynamic :id routes.
  // 'snippets/new' must be above 'snippets/:id' — otherwise Angular
  // matches /snippets/new as id="new" and sends a GET to the API with that value.
  {
    path: 'snippets/new',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/snippet-form/snippet-form')
      .then(m => m.SnippetForm)
  },
  {
    path: 'snippets/:id',
    loadComponent: () => import('./pages/snippet-detail/snippet-detail')
      .then(m => m.SnippetDetail)
  },
  {
    path: 'snippets/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/snippet-form/snippet-form')
      .then(m => m.SnippetForm)
  },

  // Catch-all — unknown URLs use the same smart redirect as the root path
  {
    path: '**',
    canActivate: [redirectGuard],
    loadComponent: () => import('./pages/snippet-list/snippet-list')
      .then(m => m.SnippetList)
  }
];