import { Avatar, Group, Paper, Stack, Title, Button, SimpleGrid, Accordion } from "@mantine/core";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import { apiGetUser } from "../../api/auth";
import { getMovieById } from "../../api/moviesAndTVSeries";
import { removeFromCollection } from "../../api/collections";
import type { User, Movie, MediaStatus } from "../../utils/types";
import { MiniMediaCard } from "../../components/MiniMediaCard/MiniMediaCard";
import { MediaModal } from "../../components/MediaModal/MediaModal";
import { getCollectionNameRU } from "../../utils/collections";

export function ProfilePage() {
  const stored = localStorage.getItem("authUser");
  const parsed: User | null = stored ? JSON.parse(stored) : null;
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalOpened, modalCtrl] = useDisclosure(false);

  const { data: user, refetch } = useQuery<User>({
    queryKey: ["currentUser", parsed?.id],
    queryFn: () => apiGetUser(parsed!.id),
    enabled: Boolean(parsed?.id),
  });

  const movieQueries = useQueries({
    queries: user?.collections
      ? Object.values(user.collections)
          .flat()
          .map((movieId) => ({
            queryKey: ["movie", movieId],
            queryFn: () =>
              getMovieById(typeof movieId === "string" ? parseInt(movieId, 10) : movieId),
            enabled: Boolean(movieId),
          }))
      : [],
  });

  const movies: Movie[] = movieQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data as Movie);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const handleDeleteFromCollection = async (movieId: string, status: MediaStatus) => {
    if (!user) return;

    try {
      await removeFromCollection(user.id, movieId, status);
      notifications.show({ 
        title: "Удалено", 
        message: `Фильм удалён из коллекции "${getCollectionNameRU(status)}"`, 
        color: "yellow" 
      });
      refetch();
    } catch (err) {
      notifications.show({ title: "Ошибка", message: "Не удалось удалить фильм из коллекции", color: "red" });
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
            Object.entries(user.collections).map(([status, ids]) => (
              <Accordion.Item key={status} value={status}>
                <Accordion.Control>{getCollectionNameRU(status)} {ids.length}</Accordion.Control>
                <Accordion.Panel>
                  <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                    {ids.map((id) => {
                      const movie = movies.find((m) => {
                        const movieId = typeof m.id === "string" ? parseInt(m.id, 10) : m.id;
                        return movieId === (typeof id === "string" ? parseInt(id, 10) : id);
                      });
                      if (!movie) return null;

                      return (
                        <MiniMediaCard
                          key={movie.id}
                          item={movie}
                          onClick={() => {
                            setSelectedMovie(movie);
                            modalCtrl.open();
                          }}
                          onDelete={() => handleDeleteFromCollection(movie.id.toString(), status as MediaStatus)}
                        />
                      );
                    })}
                  </SimpleGrid>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
        </Accordion>
      </Stack>
      
      <MediaModal opened={modalOpened} onClose={modalCtrl.close} media={selectedMovie} />
    </Paper>
  );
}
