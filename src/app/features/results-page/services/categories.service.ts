import { inject, Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Category } from '../models/Category';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor() {}

  http = inject(HttpClient);

  apiUrl = '/api/categories';

  searchCategories(query: string): Observable<Category[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    const params = new HttpParams()
      .set('names', query.trim())
      .set('page', 0)
      .set('size', 20);
    if (false) {
      return this.mockCategories(query);
    }

    return this.http
      .get<CategoriesPage>(this.apiUrl, { params })
      .pipe(map((page) => page.content));
  }

  mockCategories(query: string): Observable<Category[]> {
    const allCategories: Category[] = [
      { name: 'Science' },
      { name: 'Technology' },
      { name: 'History' },
      { name: 'Art' },
      { name: 'Sports' },
      { name: 'Mathematics' },
      { name: 'Music' },
      { name: 'Literature' },
      { name: 'Physics' },
      { name: 'Biology' },
    ];

    console.log('Searching for categories');
    const lowerQuery = query.toLowerCase();

    const filtered = allCategories.filter((c) =>
      c.name.toLowerCase().includes(lowerQuery)
    );

    // Simulate latency
    return of(filtered).pipe(delay(500)); //TODO
  }
}

export interface CategoriesPage {
  content: Category[];
}
