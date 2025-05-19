import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor() {}

  private allCategories: Category[] = [
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

  searchCategories(query: string): Observable<Category[]> {
    console.log('Searching for categories');
    const lowerQuery = query.toLowerCase();

    const filtered = this.allCategories.filter((c) =>
      c.name.toLowerCase().includes(lowerQuery)
    );

    // Simulate latency
    return of(filtered).pipe(delay(500)); //TODO
  }
}
