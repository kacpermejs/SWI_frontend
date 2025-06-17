import { ArticleType } from './ArticleType';
import { Category } from './Category';
import { SortOption } from './SortOption';

export interface Filters {
  sort?: SortOption;
  categories: Category[];
  articleType?: ArticleType;
  wordInText?: string;
}
