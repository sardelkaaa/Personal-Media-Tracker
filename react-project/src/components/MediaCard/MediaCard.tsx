import { Card, Image, Text, Box } from "@mantine/core";
import { motion } from "framer-motion";
import { getRatingColor } from "../../utils/mediaUtils";
import type { Movie } from "../../utils/types";

interface Props {
  item: Movie;
  onClick: () => void;
}

export function MediaCard({ item, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 0.95 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {item.poster && (
          <Card.Section>
            <Image src={item.poster} height={500} alt={item.title} />
          </Card.Section>
        )}

        <Box
          style={{
            background: getRatingColor(item.imdb_rating),
            color: "white",
            padding: "4px",
            borderRadius: "12px",
            width: "fit-content",
            marginTop: "8px",
          }}
        >
          {item.imdb_rating}
        </Box>

        <Text size="lg" mt="xs">{item.title}</Text>
        <Text size="sm">Жанр: {item.genre}</Text>
        <Text size="sm">Год: {item.year}</Text>
        <Text size="sm">Продолжительность: {item.runtime}</Text>
      </Card>
    </motion.div>
  );
}
