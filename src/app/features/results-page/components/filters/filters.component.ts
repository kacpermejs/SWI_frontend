import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/Category';
import { Filters } from '../../models/Filters';
import { ArticleType } from '../../models/ArticleType';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-filters',
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent implements OnChanges {
  @Input() initialCategories: Category[] = [];
  @Input() initialArticleType?: ArticleType;

  @Output() applyFilters = new EventEmitter<Filters>();

  private categoriesService = inject(CategoriesService);

  availableCategories: Category[] = [];
  articleTypeOptions = Object.values(ArticleType).map((value) => ({
    label: value.toString(),
    value: value,
  }));

  selectedCategories: Category[] = [];
  articleType?: ArticleType;

  private searchTerms = new Subject<string>();

  constructor() {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.categoriesService.searchCategories(term))
      )
      .subscribe((results) => (this.availableCategories = results));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialCategories']) {
      this.selectedCategories = this.initialCategories || [];
    }
    if (changes['initialArticleType']) {
      this.articleType = this.initialArticleType;
    }
  }

  onCategoryFilter(event: any) {
    const query = event.filter;
    if (query && query.trim().length > 0) {
      this.searchTerms.next(query);
    } else {
      this.availableCategories = [];
    }
  }

  onApplyFilters() {
    this.applyFilters.emit({
      categories: this.selectedCategories,
      articleType: this.articleType,
    });
  }
}
