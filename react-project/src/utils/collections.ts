export const COLLECTION_NAMES_RU: Record<string, string> = {
  watching: "Смотрю",
  wantToWatch: "Хочу посмотреть",
  watched: "Просмотрено",
  favorite: "Любимое",
};

export function getCollectionNameRU(key: string): string {
  return COLLECTION_NAMES_RU[key] || key;
}
