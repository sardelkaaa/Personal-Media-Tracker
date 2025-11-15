import { Button, Modal, TextInput, NumberInput, Textarea, Group, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { type MediaType, type Movie, type TVSeries } from '../../utils/types';
import { useState } from 'react';
import { addMovie, getLastMovieId, addTVSeries } from '../../api/api';

interface AddMediaFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  size: string;
  mediaType: MediaType;
  onSubmit: (data: Movie | TVSeries) => void;
}

export const AddMediaForm = ({ opened, onClose, title, size, mediaType, onSubmit }: AddMediaFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);


  const form = useForm({
    initialValues: {
      id: '',
      title: '',
      year: '',
      imdb_rating: 0,
      images: [''],
      genre: '',
      awards: '',
      actors: '',
      country: '',
      plot: '',
      poster: '',
      runtime: '',
      totalSeasons: 1,
      comingSoon: false,
    },

    validate: {
      title: (value) => value.trim().length < 2 ? 'Название должно быть не менее 2 символов' : null,
      year: (value) => !/^\d{4}$/.test(value) ? 'Год должен быть в формате YYYY' : null,
      imdb_rating: (value) => value < 0 || value > 10 ? 'Рейтинг должен быть от 0 до 10' : null,
      genre: (value) => value.trim().length === 0 ? 'Укажите жанр' : null,
      country: (value) => value.trim().length === 0 ? 'Укажите страну' : null,
      plot: (value) => value.trim().length < 10 ? 'Описание должно быть не менее 10 символов' : null,
      poster: (value) => value.trim().length === 0 ? 'Укажите ссылку на постер' : null,
      runtime: (value) => value.trim().length === 0 ? 'Укажите продолжительность' : null,
      totalSeasons: (value) => mediaType === 'tvseries' && value < 1 ? 'Количество сезонов должно быть не менее 1' : null,
    },

    validateInputOnBlur: true,
    validateInputOnChange: true,
  });


  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      let movieId: number;
      let movieIdProm: number | void;
      movieIdProm = await getLastMovieId();
      if ((typeof(movieIdProm)) === 'number') {
        movieId = movieIdProm + 1;
      } else {
        movieId = 1;
      }

      const mediaData = {
        id: movieId,
        title: values.title,
        year: values.year,
        imdb_rating: values.imdb_rating,
        images: values.images.filter(img => img.trim() !== ''),
        genre: values.genre,
        awards: values.awards,
        actors: values.actors,
        country: values.country,
        plot: values.plot,
        poster: values.poster,
        runtime: values.runtime,
        ...(mediaType === 'tvseries' && {
        totalSeasons: values.totalSeasons,
        comingSoon: values.comingSoon,
        }),
      };

      
      let savedMedia: Movie | TVSeries;


      if (mediaType === 'movie') {
        savedMedia = await addMovie(mediaData);
      } else {
        savedMedia = await addTVSeries(mediaData);
      }

      onSubmit(savedMedia);
      form.reset();
      onClose();

    } catch(err) {
      setError('Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
    >
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        {}
        <TextInput
          {...form.getInputProps('title')}
          label="Название"
          placeholder="Введите название"
          mb="md"
          required
        />

        <TextInput
          {...form.getInputProps('year')}
          label="Год выпуска"
          placeholder="2024"
          mb="md"
          required
        />

        <NumberInput
          {...form.getInputProps('imdb_rating')}
          label="Рейтинг IMDB"
          placeholder="7.5"
          min={0}
          max={10}
          step={0.1}
          mb="md"
        />

        <TextInput
          {...form.getInputProps('genre')}
          label="Жанр"
          placeholder="Драма, Комедия и т.д."
          mb="md"
          required
        />

        <TextInput
          {...form.getInputProps('country')}
          label="Страна"
          placeholder="США, Россия и т.д."
          mb="md"
          required
        />

        <TextInput
          {...form.getInputProps('actors')}
          label="Актеры"
          placeholder="Имена актеров через запятую"
          mb="md"
        />

        <Textarea
          {...form.getInputProps('plot')}
          label="Описание"
          placeholder="Краткое описание сюжета"
          mb="md"
          required
          minRows={3}
        />

        <TextInput
          {...form.getInputProps('poster')}
          label="Постер (URL)"
          placeholder="https://example.com/poster.jpg"
          mb="md"
          required
        />

        <TextInput
          {...form.getInputProps('runtime')}
          label="Продолжительность"
          placeholder={mediaType === 'movie' ? "2ч 30м" : "45м (на серию)"}
          mb="md"
          required
        />

        {mediaType === 'tvseries' && (
          <Group grow mb="md">
            <NumberInput
              {...form.getInputProps('totalSeasons')}
              label="Количество сезонов"
              placeholder="1"
              min={1}
              max={50}
            />
            <Checkbox
              {...form.getInputProps('comingSoon', { type: 'checkbox' })}
              label="Скоро выйдет"
              mt="xl"
            />
          </Group>
        )}

        <TextInput
          {...form.getInputProps('awards')}
          label="Награды"
          placeholder="Оскар, Золотой глобус и т.д."
          mb="md"
        />

        {form.values.images.map((image, index) => (
          <TextInput
            key={index}
            {...form.getInputProps(`images.${index}`)}
            label={index === 0 ? "Изображения" : ""}
            placeholder="URL изображения"
            mb="xs"
          />
        ))}

        <Button 
          type="button" 
          onClick={() => form.insertListItem('images', '')}
          variant="outline"
          mb="md"
          size="xs"
        >
          + Добавить изображение
        </Button>

        <Button type="submit" fullWidth>
          {mediaType === 'movie' ? 'Добавить фильм' : 'Добавить сериал'}
        </Button>
      </form>
    </Modal>
  );
};