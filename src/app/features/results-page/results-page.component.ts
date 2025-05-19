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
  ],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.css',
})
export class ResultsPageComponent implements OnInit {
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

      this.filters = this.extractFilters(params);
    });
  }

  ngOnInit(): void {
    this.search();
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

  onSearch() {
    const trimmedQuery = this.query?.trim();

    const categoryNamesJoined = this.filters?.categories?.length
      ? this.filters.categories.map((c) => c.name).join(',')
      : undefined;

    const articleType: ArticleType | undefined = this.filters?.articleType;
    this.router.navigate(['/results'], {
      queryParams: {
        query: trimmedQuery,
        categories: categoryNamesJoined,
        articleType: articleType,
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
}
