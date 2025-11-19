import { SimpleGrid } from "@mantine/core";
import { MediaCard } from "../MediaCard/MediaCard";
import type { Movie, User, MediaStatus } from "../../utils/types";

interface MediaGridProps {
  items: Movie[];
  currentUser?: User;
  onSelect: (item: Movie) => void;
  onToggleCollection: (collection: MediaStatus, mediaId: string) => void;
  onDelete?: (mediaId: string) => void;
}

export function MediaGrid({ items, currentUser, onSelect, onToggleCollection, onDelete }: MediaGridProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          currentUser={currentUser}
          onClick={() => onSelect(item)}
          onToggleCollection={onToggleCollection}
          onDelete={onDelete}
        />
      ))}
    </SimpleGrid>
  );
}
