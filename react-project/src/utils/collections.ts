import { notifications } from "@mantine/notifications";
import { addToCollection, removeFromCollection } from "../api/collections";
import type { MediaStatus } from "./types";

export const COLLECTION_NAMES_RU: Record<string, string> = {
  watching: "Смотрю",
  wantToWatch: "Хочу посмотреть",
  watched: "Просмотрено",
  favorite: "Любимое",
};

export function getCollectionNameRU(key: string): string {
  return COLLECTION_NAMES_RU[key] || key;
}

export async function toggleCollection(
  userId: string,
  collection: MediaStatus,
  mediaId: string,
  mediaType: "movie" | "tvseries",
  currentCollections: { id: string; type: string }[],
  invalidate: () => void,
  refetch: () => void
) {
  const currentlyInCollection = currentCollections?.some(
    (c) => c.id === mediaId && c.type === mediaType
  );

  try {
    if (currentlyInCollection) {
      await removeFromCollection(userId, mediaId, collection, mediaType);
      notifications.show({
        title: "Удалено",
        message: `Убрано из "${collection}"`,
        color: "yellow",
      });
    } else {
      await addToCollection(userId, mediaId, collection, mediaType);
      notifications.show({
        title: "Добавлено",
        message: `Добавлено в "${collection}"`,
        color: "green",
      });
    }

    invalidate();
    refetch();
  } catch (err) {
    notifications.show({
      title: "Ошибка",
      message: "Не удалось обновить коллекцию",
      color: "red",
    });
  }
}
