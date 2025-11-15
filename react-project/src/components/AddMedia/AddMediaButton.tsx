import { Button } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

export function AddMediaButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      leftSection={<IconCirclePlus size={18} />}
      variant="light"
      onClick={onClick}
    >
      Добавить свой фильм или сериал
    </Button>
  );
}
