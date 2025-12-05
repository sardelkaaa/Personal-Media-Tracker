import { SimpleGrid } from "@mantine/core";
import { MediaCard } from "../MediaCard/MediaCard";
import type { Movie, User, MediaStatus, MediaType } from "../../utils/types";

interface MediaGridProps {
  items: Movie[];
  currentUser?: User;
  onSelect: (item: Movie) => void;
  onToggleCollection: (collection: MediaStatus, mediaId: string) => void;
  onDelete?: (mediaId: string) => void;
  onEdit?: (mediaId: string) => void;
  mediaType: MediaType
  refetch: () => void;
}

export function MediaGrid({ items, currentUser, onSelect, onToggleCollection, onDelete, onEdit, mediaType, refetch }: MediaGridProps) {
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
          onEdit={onEdit}
          mediaType={mediaType}
          refetch={refetch}
        />
      ))}
    </SimpleGrid>
  );
}
