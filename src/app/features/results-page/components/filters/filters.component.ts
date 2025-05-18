import {
  Component,
  EventEmitter,
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

  categories: Category[] = [
    { name: 'Science' },
    { name: 'Technology' },
    { name: 'History' },
    { name: 'Art' },
    { name: 'Sports' },
  ];

  articleTypeOptions = Object.values(ArticleType).map((value) => ({
    label: value.toString(),
    value: value,
  }));

  selectedCategories: Category[] = [];
  articleType?: ArticleType;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialCategories']) {
      this.selectedCategories = this.initialCategories || [];
    }
    if (changes['initialArticleType']) {
      this.articleType = this.initialArticleType;
    }
  }

  onApplyFilters() {
    this.applyFilters.emit({
      categories: this.selectedCategories,
      articleType: this.articleType,
    });
  }
}
