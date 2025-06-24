export interface FilterParams {
  [key: string]: string;
}

export interface SearchQuery {
  search?: string;
  filter?: FilterParams;
}
