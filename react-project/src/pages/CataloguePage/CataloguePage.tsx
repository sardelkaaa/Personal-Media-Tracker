import { useState, useMemo } from 'react';
import { MultiSelect, Container, SimpleGrid, Card, Image, Text, Loader, Modal, Group, TextInput, Rating, Box, ActionIcon, Flex, Grid, Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { Carousel } from '@mantine/carousel';
import { useMovies } from '../../hooks/useMovies';
import classes from './CataloguePage.module.css';
import type { Movie } from '../../utils/types';
import { IconFilter, IconCirclePlus } from '@tabler/icons-react';
import { AddMediaForm } from '../../components/AddMediaForm/AddMediaForm';

export function CataloguePage() {
  const { data: movies = [], isLoading, isError } = useMovies();
  const [cardOpened, { open: openCard, close: closeCard }] = useDisclosure(false);
  const [filtersOpened, { open: openFilters, close: closeFilters }] = useDisclosure(false);
  const [addMovieOpened, { open: openAddMovie, close: closeAddMovie }] = useDisclosure(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState('');
  const [genresFilter, setGenresFilter] = useState<string[]>([]);
  const [yearsFilter, setYearsFilter] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = movies;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(lower));
    }

    if (genresFilter.length > 0) {
      result = result.filter(m =>
        genresFilter.some(g => m.genre?.toLowerCase().includes(g.toLowerCase()))
      );
    }

    if (yearsFilter.length > 0) {
      result = result.filter(m =>
        yearsFilter.includes(m.year)
      );
    }

    return result;
  }, [movies, search, genresFilter, yearsFilter]);

  const genres = useMemo(() => 
    Array.from(new Set(movies.flatMap(m => m.genre.split(', ').map(g => g.toLowerCase())))).sort()
  , [movies]);

  const years = useMemo(() => 
    Array.from(new Set(movies.map(m => m.year))).sort()
  , [movies]);

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return "linear-gradient(to right, #FFD700, #DAA520, #B8860B)";
    if (rating >= 7.0) return "#00a340";
    if (rating >= 5.5) return "#8D8D8D";
    return "#FF6347";
  };

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
    openCard();
  };

  if (isLoading) return <Loader />;
  if (isError) return <Text c="red">Ошибка загрузки данных</Text>;

  return (
    <Container>
      <Flex justify="flex-end" mb="md">
        <Button 
          leftSection={<IconCirclePlus size={18} />} 
          variant="light"
          onClick={openAddMovie}
        >
          Добавить свой фильм или сериал
        </Button>
      </Flex>

    
      <AddMediaForm 
        opened={addMovieOpened} 
        onClose={closeAddMovie} 
        title="Добавить свой фильм или сериал" 
        size="lg"
        mediaType='movie'
        onSubmit={(movie) => console.log('Новый фильм добавлен:', movie)}
        />
    

      <Flex justify="space-between" mb="xl" w="100%">
        <TextInput 
          placeholder="Поиск по названию" 
          value={search} 
          onChange={(e) => setSearch(e.currentTarget.value)} 
          w="100%"
        />
        <ActionIcon onClick={openFilters} variant="filled" aria-label="Фильтры" size="lg">
          <IconFilter style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Flex>
      
      <Drawer opened={filtersOpened} onClose={closeFilters} title="Фильтры" padding="md" position="right" size="md">
        <MultiSelect
          label="Жанр"
          placeholder="Выберите жанр"
          data={genres}
          clearable
          value={genresFilter}
          onChange={setGenresFilter}
        />
        <MultiSelect
          label="Год"
          placeholder="Выберите год"
          data={years}
          clearable
          value={yearsFilter}
          onChange={setYearsFilter}
        />
      </Drawer>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {filtered.map(movie => (
          <motion.div
            key={movie.id}
            whileHover={{ scale: 0.95 }}
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
              <Box 
              style={{ 
                background: getRatingColor(movie.imdb_rating), 
                color: 'white', 
                padding: '4px', 
                borderRadius: '12px', 
                width: 'fit-content', 
                marginTop: '8px' 
              }}>
                {movie.imdb_rating} 
              </Box>
              <Text size="lg" mt="xs">{movie.title}</Text>
              <Text size="sm">Жанр: {movie.genre}</Text>
              <Text size="sm">Год: {movie.year}</Text>
              <Text size="sm">Продолжительность: {movie.runtime}</Text>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>

      <Modal opened={cardOpened} onClose={closeCard} title={selectedMovie?.title} size="lg">
        {selectedMovie && (
          <>
            {selectedMovie.images?.length > 0 && (
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
                }}>
                {selectedMovie.images.map((image, idx) => (
                  <Carousel.Slide key={idx}>
                    <Image src={image} alt={selectedMovie.title} />
                  </Carousel.Slide>
                ))}
              </Carousel>
            )}

            <Box style={{ background: getRatingColor(selectedMovie.imdb_rating), color: 'white', padding: '4px', borderRadius: '12px', width: 'fit-content', marginTop: '8px' }}>
              {selectedMovie.imdb_rating}
            </Box>            
            <Text mt="xs">{selectedMovie.plot}</Text>
            <Text><strong>Жанр:</strong> {selectedMovie.genre || '-'}</Text>
            <Text><strong>Год:</strong> {selectedMovie.year || '-'}</Text>
            <Text><strong>Страна:</strong> {selectedMovie.country || '-'}</Text>
            <Text><strong>Актёры:</strong> {selectedMovie.actors || '-'}</Text>
            <Text><strong>Награды:</strong> {selectedMovie.awards || '-'}</Text>
            <Text><strong>Продолжительность:</strong> {selectedMovie.runtime || '-'}</Text>
          </>
        )}
      </Modal>
    </Container>
  );
}
