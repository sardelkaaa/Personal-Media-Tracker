import { useEffect, useState } from 'react';
import { MultiSelect, Container, SimpleGrid, Card, Image, Text, Loader, Modal, RingProgress, Group, TextInput, Rating } from '@mantine/core';
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
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // фильтры
  const [genresFilter, setGenresFilter] = useState<string[]>(new Array);
  const [yearsFilter, setYearsFilter] = useState<string[]>(new Array);

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
    let result = movies;

    if (genresFilter.length > 0) {
      result = result.filter((movie) => genresFilter.some((genre) => 
        movie.genre?.toLowerCase().includes(genre.toLowerCase())
      ));
    }

    if (yearsFilter.length > 0) {
      result = result.filter((movie) => 
        yearsFilter.some((year) => movie.year?.toLowerCase().includes(year.toLowerCase()))
      );
    }

    setFiltered(result);
  }, [genresFilter, yearsFilter, movies]);

  useEffect(() => {
    const lower = search.toLowerCase(); 
    const filtered = movies.filter((movie) => 
      movie.title.toLowerCase().includes(lower)
  );

    setFiltered(filtered);
  }, [search, movies]);

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
    open();
  };

  const genres = Array.from(new Set(movies.flatMap((m) => 
    m.genre.split(", ").map(elem => elem.trim().toLowerCase())
  ))).sort();

  const years = Array.from(new Set(movies.map((m) => m.year))).sort();

  return (

    <Container>
      <TextInput placeholder="Поиск по названию" value={search} onChange={(event) => setSearch(event.currentTarget.value)} mb="md" />
      <Group mb="md" grow>
        <MultiSelect
          label="Жанр"
          placeholder="Выберите жанр"
          data={genres}
          clearable
          value={genresFilter}
          onChange={setGenresFilter}
          nothingFoundMessage="Фильмов с такими жанрами нет :("
        />
        <MultiSelect
          label="Год"
          placeholder="Выберите год"
          data={years.map(String)}
          clearable
          value={yearsFilter}
          onChange={setYearsFilter}
          nothingFoundMessage="Фильмов с такими годами нет :("
        />
      </Group>

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
              <>
                {selectedMovie.images?.length > 0 && (
                  <Carousel height={300} slideSize="100%" slideGap="md" withIndicators classNames={classes}>
                    {selectedMovie.images.map((image, idx) => (
                      <Carousel.Slide key={idx}>
                        <Image src={image} alt={selectedMovie.title} />
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                )}

                <Rating value={Number(selectedMovie.imdb_rating)} readOnly />
                <Text mt="md">{selectedMovie.plot}</Text>
                <Text><strong>Жанр:</strong> {selectedMovie.genre || '-'}</Text>
                <Text><strong>Год:</strong> {selectedMovie.year || '-'}</Text>
                <Text><strong>Страна:</strong> {selectedMovie.country || '-'}</Text>
                <Text><strong>Актёры:</strong> {selectedMovie.actors || '-'}</Text>
                <Text><strong>Награды:</strong> {selectedMovie.awards || '-'}</Text>
                <Text><strong>Продолжительность:</strong> {selectedMovie.runtime || '-'}</Text>
              </>
            )}
          </Modal>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {filtered.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 0.95, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCardClick(movie)}
                style={{ cursor: 'pointer' }}
              >
                <Card shadow="sm" padding="lg" radius="md" ta="left" withBorder>
                  {movie.poster && (
                    <Card.Section>
                      <Image src={movie.poster} height={500} alt={movie.title} />
                    </Card.Section>
                  )}
                  
                  <Rating value={Number(movie.imdb_rating)} fractions={10} readOnly/>

                  <Text w={500} size="lg" mt="md">{movie.title}</Text>
                  <Text size="sm">Жанр: {movie.genre || '-'}</Text>
                  <Text size="sm">Год: {movie.year || '-'}</Text>
                  <Text size="sm">Продолжительность: {movie.runtime || '-'}</Text>
                </Card>
              </motion.div>
            ))}
          </SimpleGrid>
        </>
      )}
    </Container>
  );
}
