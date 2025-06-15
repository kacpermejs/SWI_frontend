import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FiltersComponent } from './components/filters/filters.component';
import { Filters } from './models/Filters';
import { Article, ArticleType } from './models/ArticleType';
import { SearchService } from './services/search.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SortOption } from './models/SortOption';

@Component({
  selector: 'app-results-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    PanelModule,
    DividerModule,
    InputTextModule,
    FiltersComponent,
    CardModule,
    PaginatorModule,
  ],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.css',
})
export class ResultsPageComponent {
  query: string = '';
  isCollapsed = true;
  filters?: Filters;

  isSearching = false;
  articleService = inject(SearchService);
  router = inject(Router);

  articles: Article[] = [];
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.query = this.extractQuery(params);
      this.query = this.extractQuery(params);
      this.filters = this.extractFilters(params);
      this.currentPage = parseInt(params['currentPage'], 10) || 0;
      this.pageSize = parseInt(params['pageSize'], 10) || 20;
      this.search();
    });
  }

  search() {
    this.isSearching = true;

    this.articleService
      .getItems(this.currentPage, this.pageSize, this.query, this.filters!)
      .subscribe((page) => {
        this.articles = page.content;
        this.totalPages = page.totalPages;
        this.isSearching = false;
      });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  onPageChange(event: any) {
    const newPage = event.page;
    const newSize = event.rows;

    this.router.navigate([], {
      queryParams: {
        currentPage: newPage,
        pageSize: newSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSearch() {
    const trimmedQuery = this.query?.trim();

    const categoryNamesJoined = this.filters?.categories?.length
      ? this.filters.categories.map((c) => c.name).join(',')
      : undefined;

    const articleType: ArticleType | undefined = this.filters?.articleType;
    const sort: SortOption | undefined = this.filters?.sort;
    this.router.navigate(['/results'], {
      queryParams: {
        query: trimmedQuery,
        sort: sort,
        categories: categoryNamesJoined,
        articleType: articleType,
        currentPage: 0,
        pageSize: this.pageSize,
        //no merge
      },
    });
  }

  onFiltersApplied(filters: Filters) {
    this.filters = filters;
    this.onSearch();
  }

  private extractQuery(params: Params): string {
    return params['query'] || '';
  }

  extractFilters(params: Params): Filters {
    return {
      sort: this.extractSort(params),
      categories: this.extractCategories(params),
      articleType: this.extractArticleType(params),
    };
  }

  extractArticleType(params: Params): ArticleType | undefined {
    const type = params['articleType'];

    const isValid = Object.values(ArticleType).includes(type as ArticleType);
    return isValid ? (type as ArticleType) : undefined;
  }

  private extractCategories(params: Params) {
    const categoryParam = params['categories'];
    const categoryNames: string[] = categoryParam
      ? categoryParam.split(',')
      : [];
    return categoryNames.map((n) => ({ name: n }));
  }
  private extractSort(params: Params) {
    const sort = params['articleType'];

    const isValid = Object.values(SortOption).includes(sort as SortOption);
    return isValid ? (sort as SortOption) : SortOption.Relevance;
  }
}
