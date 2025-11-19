import { useMemo, useState } from "react";
import { Container, TextInput, Flex, ActionIcon, Text, Loader } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import { useMovies } from "../../hooks/useMovies";
import { FilterDrawer } from "../../components/FilterDrawer/FilterDrawer";
import { MediaGrid } from "../../components/MediaGrid/MediaGrid";
import { MediaModal } from "../../components/MediaModal/MediaModal";
import { AddMediaButton } from "../../components/AddMedia/AddMediaButton";
import { AddMediaFormModal } from "../../components/AddMedia/AddMediaFormModal";

import { deleteMovie } from "../../api/moviesAndTVSeries";
import type { Movie, MediaStatus } from "../../utils/types";
import { notifications } from "@mantine/notifications";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { toggleCollection } from "../../utils/collections";

export function MoviesCataloguePage() {
  const { data: movies = [], isLoading, isError, refetch } = useMovies();
  const [search, setSearch] = useState("");
  const [genresFilter, setGenresFilter] = useState<string[]>([]);
  const [yearsFilter, setYearsFilter] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [filtersOpened, filtersCtrl] = useDisclosure(false);
  const [modalOpened, modalCtrl] = useDisclosure(false);
  const [addOpened, addCtrl] = useDisclosure(false);

  const { data: currentUser, invalidate } = useCurrentUser();
  const isAuthorized = !!currentUser; 


  const genres = useMemo(
    () => Array.from(new Set(movies.flatMap((m) => m.genre.split(", ").map((g) => g.toLowerCase())))).sort(),
    [movies] 
  );

  const years = useMemo(
    () => Array.from(new Set(movies.map((m) => m.year))).sort(),
    [movies]
  );

  const filtered = useMemo(() => {
    let result = movies;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(lower));
    }

    if (genresFilter.length > 0) {
      result = result.filter((m) =>
        genresFilter.some((g) => m.genre?.toLowerCase().includes(g.toLowerCase()))
      );
    }

    if (yearsFilter.length > 0) {
      result = result.filter((m) => yearsFilter.includes(m.year));
    }

    return result;
  }, [movies, search, genresFilter, yearsFilter]);

  const handleToggleCollection = (collection: MediaStatus, movieId: string) => {
    if (!currentUser) return;
    toggleCollection(
      currentUser.id,
      collection,
      movieId,
      "movie",
      currentUser.collections?.[collection] || [],
      invalidate,
      refetch
    );
  };

  const handleDelete = async (movieId: string) => {
    if (!currentUser) return;
    try {
      await deleteMovie(movieId);
      notifications.show({ title: "Удалено", message: "Фильм удалён", color: "green" });
      refetch();
    } catch (err) {
      notifications.show({ title: "Ошибка", message: "Не удалось удалить фильм", color: "red" });
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Text c="red">Ошибка загрузки данных</Text>;

  return (
    <Container>
      <Flex justify="flex-end" mb="md">
        <AddMediaButton
          onClick={addCtrl.open}
          title="Добавить свой фильм"
          disabled={!isAuthorized}
        />
      </Flex>

      <AddMediaFormModal
        opened={addOpened}
        onClose={addCtrl.close}
        type="movie"
        title="Добавить свой фильм"
        onAdded={() => refetch()}
      />

      <Flex justify="space-between" mb="xl" w="100%">
        <TextInput
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w="100%"
        />

        <ActionIcon
          onClick={filtersCtrl.open}
          variant="filled"
          aria-label="Фильтры"
          size="lg"
          style={{ marginLeft: 12 }}
        >
          <IconFilter />
        </ActionIcon>
      </Flex>

      <FilterDrawer
        opened={filtersOpened}
        onClose={filtersCtrl.close}
        genres={genres}
        years={years}
        genresFilter={genresFilter}
        yearsFilter={yearsFilter}
        onGenresChange={setGenresFilter}
        onYearsChange={setYearsFilter}
      />

      <MediaGrid
        items={filtered}
        currentUser={currentUser}
        onSelect={(movie) => { setSelectedMovie(movie); modalCtrl.open(); }}
        onToggleCollection={handleToggleCollection}
        onDelete={handleDelete}
      />

      <MediaModal
        opened={modalOpened}
        onClose={modalCtrl.close}
        media={selectedMovie}
      />
    </Container>
  );
}
