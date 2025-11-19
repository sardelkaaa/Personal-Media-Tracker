import { Avatar, Group, Paper, Stack, Title, Button, SimpleGrid, Accordion } from "@mantine/core";
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import { apiGetUser } from "../../api/auth";
import { getMovieById, getTvSeriesById } from "../../api/moviesAndTVSeries";
import { removeFromCollection } from "../../api/collections";
import type { User, Movie, TVSeries, MediaStatus } from "../../utils/types";
import { MiniMediaCard } from "../../components/MiniMediaCard/MiniMediaCard";
import { MediaModal } from "../../components/MediaModal/MediaModal";
import { getCollectionNameRU } from "../../utils/collections";

type MediaItem = (Movie | TVSeries) & { type: "movie" | "tvseries" };

export function ProfilePage() {
  const queryClient = useQueryClient();
  const stored = localStorage.getItem("authUser");
  const parsed: User | null = stored ? JSON.parse(stored) : null;
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [modalOpened, modalCtrl] = useDisclosure(false);

  const { data: user, refetch } = useQuery<User>({
    queryKey: ["currentUser", parsed?.id],
    queryFn: () => apiGetUser(parsed!.id),
    enabled: Boolean(parsed?.id),
  });

  const mediaQueries = useQueries({
    queries: user?.collections
      ? Object.values(user.collections)
          .flat()
          .map((entry) => ({
            queryKey: [entry.type, entry.id],
            queryFn: async () => {
              const data =
                entry.type === "movie"
                  ? await getMovieById(Number(entry.id))
                  : await getTvSeriesById(Number(entry.id));
              return { ...data, type: entry.type } as MediaItem;
            },
            enabled: Boolean(entry.id),
          }))
      : [],
  });

  const media: MediaItem[] = mediaQueries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => q.data!) as MediaItem[];

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const handleDeleteFromCollection = async (mediaId: string, status: MediaStatus, type: "movie" | "tvseries") => {
    if (!user) return;

    try {
      await removeFromCollection(user.id, mediaId, status, type);

      queryClient.invalidateQueries({ queryKey: ["currentUser", user.id] });

      notifications.show({
        title: "Удалено",
        message: `${type === "movie" ? "Фильм" : "Сериал"} удалён из коллекции "${getCollectionNameRU(status)}"`,
        color: "yellow",
      });

      refetch();
    } catch (err) {
      notifications.show({ title: "Ошибка", message: "Не удалось удалить из коллекции", color: "red" });
    }
  };

  return (
    <Paper p="lg" radius="md" maw={900} mx="auto" mt={60} withBorder>
      <Group justify="space-between">
        <Group>
          <Avatar size="xl" radius="lg">{user?.name?.[0]}</Avatar>
          <Stack gap={0}>
            <Title order={3}>{user?.name}</Title>
            <div>{user?.email}</div>
          </Stack>
        </Group>
        <Button color="red" variant="outline" onClick={handleLogout}>
          Выйти
        </Button>
      </Group>

      <Stack mt="lg">
        <Accordion variant="separated" multiple>
          {user?.collections &&
            Object.entries(user.collections).map(([status, entries]) => (
              <Accordion.Item key={status} value={status}>
                <Accordion.Control>{getCollectionNameRU(status)} {entries.length}</Accordion.Control>
                <Accordion.Panel>
                  <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                    {entries.map((entry) => {
                      const item = media.find(m => m.id.toString() === entry.id && m.type === entry.type);
                      if (!item) return null;

                      return (
                        <MiniMediaCard
                          key={`${item.type}-${item.id}`}
                          item={item}
                          onClick={() => {
                            setSelectedMedia(item);
                            modalCtrl.open();
                          }}
                          onDelete={() => handleDeleteFromCollection(item.id.toString(), status as MediaStatus, item.type)}
                        />
                      );
                    })}
                  </SimpleGrid>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
        </Accordion>
      </Stack>

      <MediaModal opened={modalOpened} onClose={modalCtrl.close} media={selectedMedia} />
    </Paper>
  );
}
