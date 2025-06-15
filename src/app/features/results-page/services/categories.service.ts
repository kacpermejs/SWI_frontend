import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Category } from '../models/Category';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor() {}

  http = inject(HttpClient);

  apiUrl = 'http://localhost:8080/api/categories';

  searchCategories(query: string): Observable<Category[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    const params = new HttpParams().set('q', query.trim()); //TODO set proper parameter

    if (true) {
      return this.mockCategories(query);
    }

    return this.http.get<Category[]>(this.apiUrl, { params });
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
