import { Drawer, MultiSelect } from "@mantine/core";

interface Props {
  opened: boolean;
  onClose: () => void;

  genres: string[];
  years: string[];

  genresFilter: string[];
  yearsFilter: string[];

  onGenresChange: (values: string[]) => void;
  onYearsChange: (values: string[]) => void;
}

export function FilterDrawer({
  opened,
  onClose,
  genres,
  years,
  genresFilter,
  yearsFilter,
  onGenresChange,
  onYearsChange,
}: Props) {
  return (
    <Drawer opened={opened} onClose={onClose} title="Фильтры" padding="md" position="right" size="md">
      <MultiSelect
        label="Жанр"
        placeholder="Выберите жанр"
        data={genres}
        clearable
        value={genresFilter}
        onChange={onGenresChange}
      />

      <MultiSelect
        label="Год"
        placeholder="Выберите год"
        data={years}
        clearable
        value={yearsFilter}
        onChange={onYearsChange}
      />
    </Drawer>
  );
}
