export enum ArticleType {
  Featured = 'Featured',
  Good = 'Good',
}

export interface Article {
  title: string;
  text: string;
  type: ArticleType;
  categories: string[];
  url: string;
}
