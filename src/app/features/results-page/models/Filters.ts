import { ArticleType } from './ArticleType';
import { Category } from './Category';

export interface Filters {
  categories: Category[];
  articleType?: ArticleType;
}
