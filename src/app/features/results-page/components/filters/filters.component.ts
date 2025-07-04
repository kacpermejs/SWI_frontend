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
import { SortOption } from '../../models/SortOption';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-filters',
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent implements OnChanges {
  @Input() initialCategories: Category[] = [];
  @Input() initialArticleType?: ArticleType;
  @Input() initialSort?: SortOption;
  @Input() initialWordInText?: string;

  @Output() applyFilters = new EventEmitter<Filters>();

  private categoriesService = inject(CategoriesService);

  //filters
  wordInText?: string;

  availableCategories: Category[] = [];
  articleTypeOptions = Object.values(ArticleType).map((value) => ({
    label: value.toString(),
    value: value,
  }));

  sortOptions = [
    { label: 'Relevance', value: SortOption.Relevance },
    { label: 'Name A-Z', value: SortOption.TitleAsc },
    { label: 'Name Z-A', value: SortOption.TitleDesc },
  ];

  selectedSort: SortOption = SortOption.Relevance;
  selectedCategories: Category[] = [];
  articleType?: ArticleType;

  private searchTerms = new Subject<string>();

  constructor() {
    this.searchTerms
      .pipe(
        debounceTime(300),
        switchMap((term) => this.categoriesService.searchCategories(term))
      )
      .subscribe((results) => {
        const selected = this.selectedCategories ?? [];

        const filteredResults = results.filter(
          (r) => !selected.some((sel) => sel.name === r.name)
        );

        this.availableCategories = [...selected, ...filteredResults];
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialCategories']) {
      this.selectedCategories = this.initialCategories || [];
    }
    if (changes['initialArticleType']) {
      this.articleType = this.initialArticleType;
    }
    if (changes['initialSort']) {
      this.selectedSort = this.initialSort || SortOption.Relevance;
    }
    if (changes['initialWordInText']) {
      this.wordInText = this.initialWordInText || undefined;
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

  removeCategory(categoryToRemove: Category) {
    this.selectedCategories = this.selectedCategories.filter(
      (cat) => cat.name !== categoryToRemove.name
    );
  }

  onApplyFilters() {
    this.applyFilters.emit({
      sort: this.selectedSort as SortOption,
      categories: this.selectedCategories,
      articleType: this.articleType,
      wordInText: this.wordInText,
    });
  }
}
