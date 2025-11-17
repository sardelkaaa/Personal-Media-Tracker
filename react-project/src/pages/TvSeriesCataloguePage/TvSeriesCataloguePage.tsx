import { useMemo, useState } from "react";
import { Container, TextInput, Flex, ActionIcon, Text, Loader } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import { useTvSeries } from "../../hooks/useTvSeries";
import { FilterDrawer } from "../../components/FilterDrawer/FilterDrawer";
import { MediaGrid } from "../../components/MediaGrid/MediaGrid";
import { MediaModal } from "../../components/MediaModal/MediaModal";
import { AddMediaButton } from "../../components/AddMedia/AddMediaButton";
import { AddMediaFormModal } from "../../components/AddMedia/AddMediaFormModal";

import { addToCollection, removeFromCollection } from "../../api/collections";
import { deleteTvSeries } from "../../api/moviesAndTVSeries";
import type { Movie, User, MediaStatus } from "../../utils/types";
import { notifications } from "@mantine/notifications";
import { apiGetUser } from "../../api/auth";

export function TvSeriesCataloguePage() {
  const { data: tvSeries = [], isLoading, isError, refetch } = useTvSeries();
  const [search, setSearch] = useState("");
  const [genresFilter, setGenresFilter] = useState<string[]>([]);
  const [yearsFilter, setYearsFilter] = useState<string[]>([]);
  const [selectedTv, setSelectedTv] = useState<Movie | null>(null);
  const [filtersOpened, filtersCtrl] = useDisclosure(false);
  const [modalOpened, modalCtrl] = useDisclosure(false);
  const [addOpened, addCtrl] = useDisclosure(false);

  const storedUser = localStorage.getItem("authUser");
  const [currentUser, setCurrentUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  const isAuthorized = !!currentUser;

  const genres = useMemo(
    () => Array.from(new Set(tvSeries.flatMap((m) => m.genre.split(", ").map((g) => g.toLowerCase())))).sort(),
    [tvSeries]
  );

  const years = useMemo(
    () => Array.from(new Set(tvSeries.map((m) => m.year))).sort(),
    [tvSeries]
  );

  const filtered = useMemo(() => {
    let result = tvSeries;

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
  }, [tvSeries, search, genresFilter, yearsFilter]);

  const handleToggleCollection = async (collection: MediaStatus, movieId: string) => {
    if (!currentUser) return;

    const currentlyInCollection = currentUser.collections?.[collection]?.includes(movieId) ?? false;

    try {
      if (!currentlyInCollection) {
        await addToCollection(currentUser.id, movieId, collection);
        notifications.show({ title: "Успешно", message: `Добавлено в "${collection}"`, color: "green" });
      } else {
        await removeFromCollection(currentUser.id, movieId, collection);
        notifications.show({ title: "Успешно", message: `Удалено из "${collection}"`, color: "yellow" });
      }

      const updatedUser = await apiGetUser(currentUser.id);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      refetch();
    } catch (err) {
      notifications.show({ title: "Ошибка", message: "Не удалось изменить коллекцию", color: "red" });
    }
  };


  const handleDelete = async (tvId: string) => {
    if (!currentUser) return;
    try {
      await deleteTvSeries(tvId);
      notifications.show({ title: "Удалено", message: "Сериал удалён", color: "green" });
      refetch();
    } catch (err) {
      notifications.show({ title: "Ошибка", message: "Не удалось удалить сериал", color: "red" });
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Text c="red">Ошибка загрузки данных</Text>;

  return (
    <Container>
      <Flex justify="flex-end" mb="md">
        <AddMediaButton
          onClick={addCtrl.open}
          title="Добавить свой сериал"
          disabled={!isAuthorized}
        />
      </Flex>

      <AddMediaFormModal
        opened={addOpened}
        onClose={addCtrl.close}
        type="tvseries"
        title="Добавить свой сериал"
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
        onSelect={(tv) => { setSelectedTv(tv); modalCtrl.open(); }}
        onToggleCollection={handleToggleCollection}
        onDelete={handleDelete}
      />

      <MediaModal
        opened={modalOpened}
        onClose={modalCtrl.close}
        media={selectedTv}
      />
    </Container>
  );
}
