import { SimpleGrid } from "@mantine/core";
import { MediaCard } from "../MediaCard/MediaCard";
import type { Movie } from "../../utils/types";

interface Props {
  items: Movie[];
  onSelect: (item: Movie) => void;
}

export function MediaGrid({ items, onSelect }: Props) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} onClick={() => onSelect(item)} />
      ))}
    </SimpleGrid>
  );
}
