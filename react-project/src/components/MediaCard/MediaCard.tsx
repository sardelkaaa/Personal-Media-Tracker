import { Card, Image, Text, Box, Menu, Button, Modal } from "@mantine/core";
import { motion } from "framer-motion";
import { getRatingColor } from "../../utils/mediaUtils";
import type { Movie, User, MediaStatus, Collections, TVSeries, MediaType } from "../../utils/types";
import { EditMediaButton } from "../EditMediaButton/EditMediaButton";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { EditMediaForm } from "../EditMediaForm/EditMediaForm";
import { notifications } from "@mantine/notifications";

interface Props {
  item: Movie;
  onClick: () => void;
  currentUser?: User;
  onToggleCollection: (collection: MediaStatus, mediaId: string) => void;
  onDelete?: (mediaId: string) => void;
  onEdit?: (mediaId: string) => void;
  mediaType: MediaType;
  refetch: () => void;
}

export function MediaCard({ item, onClick, currentUser, onToggleCollection, onDelete, onEdit, mediaType, refetch }: Props) {
  const isOwner = currentUser?.id === item.userId;
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    open();
  };

  useEffect(() => {
    if (!opened) {
      const timer = setTimeout(() => setIsEditing(false), 100);
      return () => clearTimeout(timer);
    }
  }, [opened]);

  const collections: Collections = currentUser?.collections || {
    watching: [],
    wantToWatch: [],
    watched: [],
    favorite: [],
  };

  const isInCollection = (status: MediaStatus) =>
    collections[status]?.some((c) => c.id === item.id && c.type === item.type);

  return (
    <motion.div
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.9 }}
      onClick={isEditing ? undefined : onClick}
      style={{ cursor: isEditing ? "default" : "pointer" }}
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

        

        {currentUser && isOwner && onEdit && (
          <EditMediaButton onClick={handleEditClick}></EditMediaButton>
        )}

        <EditMediaForm
          opened={opened}
          onClose={close}
          title="Редактирование медиа"
          size="lg"
          mediaType={mediaType}
          mediaId={parseInt(item.id)}
          onSubmit={(item: TVSeries | Movie) => {
            notifications.show({ title: "Успешно", message: `${item.title} изменен`, color: "green" });
            refetch();
          }}>
        </EditMediaForm>

        {currentUser && isOwner && onDelete && (
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
