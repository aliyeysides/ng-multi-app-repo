export interface Idea {
  symbol: string;
  raw_PGR: number;
  industry_name: string;
  Change: string;
  filter: number;
  Last: number;
  signals: string;
  market_cap: number;
  div_yield: number;
  name: string;
  list_rating: number;
  PGR: number;
  TechnicalRating: number;
  Percentage: number;
  industry_ListID: number;
  SummaryRating: number;
}

export interface IdeaList {
  is_active: boolean;
  is_extendable: boolean;
  list_id: number;
  list_type: string;
  name: string;
  pgr_rating_order: number;
  power_Bar: string;
}
