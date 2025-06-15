import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Filters } from '../models/Filters';
import { ArticlePage } from '../models/ArticlePage';
import { Article, ArticleType } from '../models/ArticleType';
import { SortOption } from '../models/SortOption';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/search';

  constructor() {}

  getItems(
    page: number,
    size: number,
    query: string,
    filters: Filters
  ): Observable<ArticlePage> {
    let params = new HttpParams()
      .set('page', page.toString()) // page is 0-based
      .set('size', size.toString());

    if (filters.sort) {
      params = params.set('sort', this.getSortParam(filters.sort));
    }

    const body = {
      title: query || null,
      text: query || null, //TODO now Title Or Text
      categories: filters.categories?.map((cat) => cat.name) ?? [],
    };

    if (!query) {
      return of();
    }

    if (true) {
      return of(this.mockSearchRequest(page, size, query, filters)).pipe(
        delay(1000)
      );
    }

    return this.http.post<ArticlePage>(this.apiUrl, body, { params });
  }

  private getSortParam(sort: SortOption): string {
    switch (sort) {
      case SortOption.TitleAsc:
        return 'title,asc';
      case SortOption.TitleDesc:
        return 'title,desc';
      default:
        return 'relevance,desc';
    }
  }

  private mockSearchRequest(
    page: number,
    size: number,
    query: string,
    filters: Filters
  ): ArticlePage {
    const totalItems = 50;
    const totalPages = Math.ceil(totalItems / size);
    const startIndex = page * size;
    const endIndex = Math.min(startIndex + size, totalItems);
    const numberOfElements = endIndex - startIndex;

    const mockArticle: Article = {
      title: 'Angular (web framework)',
      text: 'Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations.',
      type: ArticleType.Good,
      categories: ['Science', 'Technology'],
      url: 'https://en.wikipedia.org/wiki/Angular_(web_framework)',
    };

    const content = Array.from({ length: numberOfElements }, (_, index) => ({
      ...mockArticle,
      title: `${index + 1 + page * size}. ${mockArticle.title}`,
    }));

    return {
      content,
      totalPages,
      totalElements: totalItems,
      size,
      number: page,
      numberOfElements,
      first: page === 0,
      last: page === totalPages - 1,
    } as ArticlePage;
  }
}
