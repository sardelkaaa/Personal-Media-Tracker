import { AddMediaForm } from "../AddMediaForm/AddMediaForm";
import type { MediaType } from "../../utils/types";

interface Props {
  opened: boolean;
  onClose: () => void;
  type: MediaType;
}

export function AddMediaFormModal({ opened, onClose, type }: Props) {
  return (
    <AddMediaForm
      opened={opened}
      onClose={onClose}
      title="Добавить свой фильм или сериал"
      size="lg"
      mediaType={type}
      onSubmit={(item) => console.log("Добавлено новое медиа:", item)}
    />
  );
}
