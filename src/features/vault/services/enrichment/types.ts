export type EnrichResponse = {
  title: string | null;
  description: string | null;
  summary: string | null;
  image: string | null;
  category: string | null;
  suggestedCategories?: string[];
  youtubeId?: string | null;
};

export interface AIResult {
  title: string;
  summary: string;
  description: string;
  category: string;
  suggestedCategories: string[];
}

export interface ScrapedMetadata {
  title: string | null;
  description: string | null;
  image: string | null;
  youtubeId?: string | null;
}
