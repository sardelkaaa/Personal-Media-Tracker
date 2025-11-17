import { Card, Image, Text, Box, Menu, Button } from "@mantine/core";
import { motion } from "framer-motion";
import { getRatingColor } from "../../utils/mediaUtils";
import type { Movie, User, MediaStatus } from "../../utils/types";

interface Props {
  item: Movie;
  onClick: () => void;
  currentUser: User | null;
  onToggleCollection: (collection: MediaStatus, mediaId: string) => void;
  onDelete?: (mediaId: string) => void;
}

export function MediaCard({ item, onClick, currentUser, onToggleCollection, onDelete }: Props) {
  const isOwner = currentUser?.id === item.userId;

  const collections: Record<MediaStatus, string[]> = currentUser?.collections || {
    watching: [],
    wantToWatch: [],
    watched: [],
    favorite: [],
  };

  const isInCollection = (status: MediaStatus) =>
    collections[status]?.includes(item.id.toString());

  return (
    <motion.div
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {item.poster && <Card.Section><Image src={item.poster} height={500} alt={item.title} /></Card.Section>}

        <Box
          style={{
            background: getRatingColor(item.imdb_rating),
            color: "white",
            padding: "4px",
            borderRadius: "12px",
            width: "fit-content",
            marginTop: "8px",
          }}
        >
          {item.imdb_rating.toFixed(1)}
        </Box>

        <Text size="lg" mt="xs">{item.title}</Text>
        <Text size="sm">Жанр: {item.genre}</Text>
        <Text size="sm">Год: {item.year}</Text>
        <Text size="sm">Продолжительность: {item.runtime}</Text>

        {currentUser && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button mt="sm" fullWidth onClick={(e) => e.stopPropagation()}>
                Коллекции
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {(['watching', 'wantToWatch', 'watched', 'favorite'] as MediaStatus[]).map((status) => (
                <Menu.Item
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCollection(status, item.id.toString());
                  }}
                >
                  {status === 'watching' ? 'Смотрю' :
                   status === 'wantToWatch' ? 'Хочу посмотреть' :
                   status === 'watched' ? 'Просмотрено' :
                   'Любимое'}
                  {isInCollection(status) ? ' ✓' : ''}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}

        {isOwner && onDelete && (
          <Button
            color="red"
            variant="outline"
            fullWidth
            mt="xs"
            onClick={(e) => { e.stopPropagation(); onDelete(item.id.toString()); }}
          >
            Удалить
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
