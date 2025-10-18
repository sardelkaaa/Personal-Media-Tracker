import { useEffect, useState } from 'react';
import { TextInput, Container, SimpleGrid, Card, Image, Text, Loader, Modal, RingProgress } from '@mantine/core';
import { getMovies } from '../../api/api';
import type { Movie } from '../../utils/types';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { Carousel } from '@mantine/carousel';
import classes from './CatalogueMoviesPage.module.css';

export function CatalogueMoviesPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filtered, setFiltered] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
        setFiltered(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lower) ||
        movie.genre?.toLowerCase().includes(lower)
    );
    setFiltered(filtered);
  }, [search, movies]);

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
    open();
  };

  const movieSlides = (images: string[], id?: number, title?: string) => 
    (images.map((image) => (
      <Carousel.Slide key={id}>
        <Image 
          src={image}
          alt={title}
        />
      </Carousel.Slide>
    )))

  return (
    <Container>
      <TextInput
        placeholder="Поиск по названию или жанру"
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        mb="md"
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          <Modal 
            opened={opened} 
            onClose={close}
            title={selectedMovie?.title}
            size='lg'
          >
            {selectedMovie && (
              <div>
                {selectedMovie.images && selectedMovie.images.length > 0 && (
                  <Carousel
                    height={300} 
                    slideSize="100%"
                    slideGap="md"
                    withIndicators
                    classNames={classes}
                    emblaOptions={{
                    loop: true,
                    dragFree: false,
                    align: 'center'
                  }}
                  >
                    {movieSlides(selectedMovie.images, selectedMovie.id, selectedMovie.title)}
                  </Carousel>
                )}

                <RingProgress label={
                  <Text size="xs" ta="center">
                    {selectedMovie.imdb_rating || '0'}
                  </Text>} 
                  sections={[{value: Number(selectedMovie.imdb_rating) * 10 || 0, color: 'blue'}]} />

                {selectedMovie.plot && (
                  <Text mt="md">{selectedMovie.plot}</Text>
                )}
                <Text><strong>Жанр:</strong> {selectedMovie.genre || '-'}</Text>
                <Text><strong>Год:</strong> {selectedMovie.year || '—'}</Text>
                <Text><strong>Страна:</strong> {selectedMovie.country || '—'}</Text>
                <Text><strong>Актёры:</strong> {selectedMovie.actors || '—'}</Text>
                <Text><strong>Награды:</strong> {selectedMovie.awards || '—'}</Text>
                <Text><strong>Продолжительность:</strong> {selectedMovie.runtime || '—'}</Text>
              </div>
            )}
          </Modal>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {filtered.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ 
                  scale: 0.95,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCardClick(movie)}
                style={{ cursor: 'pointer' }}
              >
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  ta="left"
                  withBorder
                >
                  {movie.poster && (
                    <Card.Section>
                      <Image 
                        src={movie.poster} 
                        height={500} 
                        alt={movie.title} 
                      />
                    </Card.Section>
                  )}
                  
                  <RingProgress label={
                  <Text size="xs" ta="center">
                    {movie.imdb_rating || '0'}
                  </Text>} 
                  sections={[{value: Number(movie.imdb_rating) * 10 || 0, color: 'blue'}]} />

                  <Text w={500} size="lg" mt="md">
                    {movie.title}
                  </Text>
                  
                  <Text size="sm">
                    Жанр: {movie.genre || '-'}
                  </Text>
                  
                  <Text size="sm">
                    Год: {movie.year || '-'}
                  </Text>

                  <Text size="sm">
                    Продолжительность: {movie.runtime || '-'}
                  </Text>
                </Card>
              </motion.div>
            ))}
          </SimpleGrid>
        </>
      )}
    </Container>
  );
}