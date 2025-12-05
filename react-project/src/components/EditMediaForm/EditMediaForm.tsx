import { Button, Modal, TextInput, NumberInput, Textarea, Group, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import type { MediaType, Movie, TVSeries, User } from '../../utils/types';
import { getMovieById, getTvSeriesById, updateMovie, updateTvSeries } from '../../api/moviesAndTVSeries';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

interface EditMediaFormProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  size: string;
  mediaType: MediaType;
  mediaId: number;
  onSubmit: (data: Movie | TVSeries) => void;
}

export const EditMediaForm = ({ opened, onClose, title, size, mediaType, mediaId, onSubmit }: EditMediaFormProps) => {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<TVSeries | Movie | null>(null);

  const storedUser = localStorage.getItem('authUser');
  const currentUser: User | null = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (opened && mediaId) {
      fetchMediaData();
    }
  }, [opened, mediaId]);

  const fetchMediaData = async () => {
    setLoading(true);
    try {
        if (mediaType === 'tvseries') {
            const media: TVSeries = await getTvSeriesById(mediaId);
            setInitialData(media);
            form.setValues({
            title: media.title || '',
            year: media.year || '',
            imdb_rating: media.imdb_rating || 0,
            genre: media.genre || '',
            awards: media.awards || '',
            actors: media.actors || '',
            country: media.country || '',
            plot: media.plot || '',
            poster: media.poster || '',
            runtime: media.runtime || '',
            totalSeasons: media.totalSeasons || 1,
            comingSoon: media.comingSoon || false,
            images: media.images || []
        })} else {
            const media: Movie = await getMovieById(mediaId);
            setInitialData(media);
            form.setValues({
            title: media.title || '',
            year: media.year || '',
            imdb_rating: media.imdb_rating || 0,
            genre: media.genre || '',
            awards: media.awards || '',
            actors: media.actors || '',
            country: media.country || '',
            plot: media.plot || '',
            poster: media.poster || '',
            runtime: media.runtime || '',
            images: media.images || []
        })}; 
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось загрузить данные сериала',
        color: 'red',
        icon: <IconX size={16} />,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const form = useForm({
    initialValues: {
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
    validateInputOnBlur: true,
    validate: {
      title: (v) => v.trim().length < 2 ? 'Название должно быть не менее 2 символов' : null,
      year: (v) => !/^\d{4}$/.test(v) ? 'Год должен быть в формате YYYY' : null,
      imdb_rating: (v) => v < 0 || v > 10 ? 'Рейтинг должен быть от 0 до 10' : null,
      genre: (v) => v.trim().length === 0 ? 'Укажите жанр' : null,
      country: (v) => v.trim().length === 0 ? 'Укажите страну' : null,
      plot: (v) => v.trim().length < 10 ? 'Описание должно быть не менее 10 символов' : null,
      poster: (v) => v.trim().length === 0 ? 'Укажите ссылку на постер' : null,
      runtime: (v) => v.trim().length === 0 ? 'Укажите продолжительность' : null,
      totalSeasons: (v) => mediaType === 'tvseries' && v < 1 ? 'Количество сезонов должно быть не менее 1' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!currentUser) {
      notifications.show({ title: 'Ошибка', message: 'Вы должны быть авторизованы', color: 'red' });
      return;
    }

    setLoading(true);
    try {
        if (!initialData) {
            throw new Error('Данные медиа не загружены');
        }

        const updateData: TVSeries | Movie = {
            id: initialData.id,
            type: initialData.type,
            userId: initialData.userId,
            title: values.title,
            year: values.year,
            imdb_rating: values.imdb_rating,
            images: values.images,
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

        const updatedMedia = mediaType === 'tvseries' 
            ? await updateTvSeries(mediaId, updateData)
            : await updateMovie(mediaId, updateData);
        

        onSubmit(updatedMedia);
        form.reset();
        onClose();

    } catch (err) {
        notifications.show({ title: 'Ошибка', message: 'Не удалось изменить медиа', color: 'red' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} size={size}>
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <TextInput {...form.getInputProps('title')} label="Название" placeholder="Введите название" mb="md" required />
        <TextInput {...form.getInputProps('year')} label="Год выпуска" placeholder="2024" mb="md" required />
        <NumberInput {...form.getInputProps('imdb_rating')} label="Рейтинг IMDB" placeholder="7.5" min={0} max={10} step={0.1} mb="md" />
        <TextInput {...form.getInputProps('genre')} label="Жанр" placeholder="Драма, Комедия" mb="md" required />
        <TextInput {...form.getInputProps('country')} label="Страна" placeholder="США, Россия" mb="md" required />
        <TextInput {...form.getInputProps('actors')} label="Актеры" placeholder="Имена через запятую" mb="md" />
        <Textarea {...form.getInputProps('plot')} label="Описание" placeholder="Краткое описание сюжета" mb="md" required minRows={3} />
        <TextInput {...form.getInputProps('poster')} label="Постер (URL)" placeholder="https://example.com/poster.jpg" mb="md" required />
        <TextInput {...form.getInputProps('runtime')} label="Продолжительность" placeholder={mediaType === 'movie' ? "2ч 30м" : "45м (на серию)"} mb="md" required />

        {mediaType === 'tvseries' && (
          <Group grow mb="md">
            <NumberInput {...form.getInputProps('totalSeasons')} label="Количество сезонов" placeholder="1" min={1} max={50} />
            <Checkbox {...form.getInputProps('comingSoon', { type: 'checkbox' })} label="Скоро выйдет" mt="xl" />
          </Group>
        )}

        {form.values.images.map((_image, index) => (
          <TextInput key={index} {...form.getInputProps(`images.${index}`)} label={index === 0 ? "Изображения" : ""} placeholder="URL изображения" mb="xs" />
        ))}

        <Button type="button" onClick={() => form.insertListItem('images', '')} variant="outline" mb="md" size="xs">
          + Добавить изображение
        </Button>

        <Button type="submit" fullWidth loading={loading}>
            Сохранить изменения
        </Button>
      </form>
    </Modal>
  );
};
