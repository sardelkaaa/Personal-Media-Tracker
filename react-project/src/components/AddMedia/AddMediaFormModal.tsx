// AddMediaFormModal.tsx
import { AddMediaForm } from "../AddMediaForm/AddMediaForm";
import type { MediaType, Movie, TVSeries } from "../../utils/types";
import { notifications } from "@mantine/notifications";

interface AddMediaFormModalProps {
  opened: boolean;
  onClose: () => void;
  type: MediaType;
  title: string;
  onAdded?: (item: Movie | TVSeries) => void;
}

export function AddMediaFormModal({ opened, onClose, type, title, onAdded }: AddMediaFormModalProps) {
  return (
    <AddMediaForm
      opened={opened}
      onClose={onClose}
      title={title}
      size="lg"
      mediaType={type}
      onSubmit={(item) => {
        notifications.show({ title: "Успешно", message: `${item.title} добавлен`, color: "green" });
        onAdded?.(item);
      }}
    />
  );
}
