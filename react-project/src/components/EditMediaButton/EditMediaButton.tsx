import { Button } from "@mantine/core";

interface EditMediaButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export function EditMediaButton({onClick}: EditMediaButtonProps) {
  return (
    <Button
        color="yellow"
        variant="outline"
        fullWidth
        mt="xs"
        onClick={onClick}
    >
        Редактировать
    </Button>
  );
}
