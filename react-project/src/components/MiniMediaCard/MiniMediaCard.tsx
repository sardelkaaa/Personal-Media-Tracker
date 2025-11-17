import { Card, Image, Text, Box, Button, Group } from "@mantine/core";
import { motion } from "framer-motion";
import { getRatingColor } from "../../utils/mediaUtils";
import type { Movie } from "../../utils/types";

interface Props {
  item: Movie;
  onClick?: () => void;
  onDelete?: (mediaId: string) => void;
}

export function MiniMediaCard({ item, onClick, onDelete }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 150 }}>
        {item.poster && (
          <Card.Section>
            <Image src={item.poster} height={200} alt={item.title} />
          </Card.Section>
        )}

        <Box
          style={{
            background: getRatingColor(item.imdb_rating),
            color: "white",
            padding: "2px 6px",
            borderRadius: "8px",
            width: "fit-content",
            marginTop: 4,
            fontSize: 12,
          }}
        >
          {item.imdb_rating.toFixed(1)}
        </Box>

        <Text size="sm" mt={4} lineClamp={2}>
          {item.title}
        </Text>

        {onDelete && (
          <Group mt="xs">
            <Button
              color="red"
              size="xs"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id.toString());
              }}
            >
              Удалить
            </Button>
          </Group>
        )}
      </Card>
    </motion.div>
  );
}
