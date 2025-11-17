export type MobileNavigationProps = {
  opened: boolean;
  toggle: () => void;
  close: () => void;
};

interface BaseMedia {
  id: string;
  title: string;
  year: string;
  imdb_rating: number;
  images: string[];
  genre: string;
  awards: string;
  actors: string;
  country: string;
  plot: string;
  poster: string;
  runtime: string;
  userId: string;
}

export type Movie = BaseMedia;

export type TVSeries = BaseMedia & {
  totalSeasons?: number;
  comingSoon?: boolean;
};

export type MediaType = 'movie' | 'tvseries';

export type MediaStatus = 'watching' | 'wantToWatch' | 'watched' | 'favorite';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  collections?: Record<MediaStatus, string[]>;
}


export interface LoginPayload {
email: string;
password: string;
}

export interface RegisterPayload {
email: string;
password: string;
name: string;
}