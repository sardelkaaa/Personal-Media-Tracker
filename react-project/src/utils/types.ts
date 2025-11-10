export type MobileNavigationProps = {
  opened: boolean;
  toggle: () => void;
  close: () => void;
};

interface BaseMedia {
  id: number;
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
}

export type Movie = BaseMedia;

export type TVSeries = BaseMedia & {
  totalSeasons?: number;
  comingSoon?: boolean;
};