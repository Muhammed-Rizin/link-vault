import { VaultLink } from "@/shared/services/supabase";

const CATEGORY_LEVELS: Record<string, number> = {
  "All": 0,
  "Research": 1,
  "Creative": 2,
  "Learn": 3,
  "AI Coding": 4,
  "AI Tools": 5,
  "Design": 6,
  "DevTools": 7,
  "News": 8,
  "Resource": 9,
  "Software": 10,
  "Web": 11,
  "Social": 12,
  "Video": 13,
  "Community": 14,
  "Professional": 15,
};

export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const levelA = CATEGORY_LEVELS[a] ?? 999;
    const levelB = CATEGORY_LEVELS[b] ?? 999;

    if (levelA !== levelB) {
      return levelA - levelB;
    }

    return a.localeCompare(b);
  });
}
