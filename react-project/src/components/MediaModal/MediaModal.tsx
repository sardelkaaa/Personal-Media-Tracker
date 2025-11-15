import { Modal, Text, Box, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import classes from "./MediaModal.module.css";
import { getRatingColor } from "../../utils/mediaUtils";
import type { Movie } from "../../utils/types";

interface Props {
  opened: boolean;
  onClose: () => void;
  media: Movie | null;
}

export function MediaModal({ opened, onClose, media }: Props) {
  if (!media) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={media.title} size="lg">
      {media.images?.length > 0 && (
        <Carousel
          height={300}
          slideSize="100%"
          slideGap="md"
          withIndicators
          classNames={classes}
          emblaOptions={{
            loop: true,
            dragFree: false,
            align: "center",
          }}
        >
          {media.images.map((image, idx) => (
            <Carousel.Slide key={idx}>
              <Image src={image} alt={media.title} />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}

      <Box
        style={{
          background: getRatingColor(media.imdb_rating),
          color: "white",
          padding: "4px",
          borderRadius: "12px",
          width: "fit-content",
          marginTop: "8px",
        }}
      >
        {media.imdb_rating}
      </Box>

      <Text mt="xs">{media.plot}</Text>
      <Text><strong>Жанр:</strong> {media.genre || "-"}</Text>
      <Text><strong>Год:</strong> {media.year || "-"}</Text>
      <Text><strong>Страна:</strong> {media.country || "-"}</Text>
      <Text><strong>Актёры:</strong> {media.actors || "-"}</Text>
      <Text><strong>Награды:</strong> {media.awards || "-"}</Text>
      <Text><strong>Продолжительность:</strong> {media.runtime || "-"}</Text>
    </Modal>
  );
}
