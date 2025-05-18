import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'results',
    loadChildren: () =>
      import('./features/results-page/results-page.routes').then(
        (r) => r.RESULT_PAGE_ROUTES
      ),
  },
  {
    path: 'article/:id',
    loadComponent: () =>
      import('./features/article-page/article-page.component').then(
        (m) => m.ArticlePageComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
