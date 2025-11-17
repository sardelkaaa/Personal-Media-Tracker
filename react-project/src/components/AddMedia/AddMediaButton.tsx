import { Button } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

interface AddMediaButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
}

export function AddMediaButton({ onClick, title, disabled }: AddMediaButtonProps) {
  return (
    <Button
      leftSection={<IconCirclePlus size={18} />}
      variant="light"
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </Button>
  );
}
