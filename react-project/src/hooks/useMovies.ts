import { useQuery } from '@tanstack/react-query';
import { getMovies } from '../api/api';
import type { Movie } from '../utils/types';

export const useMovies = () => {
  return useQuery<Movie[]>({
    queryKey: ['movies'],
    queryFn: getMovies,
    staleTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: false,
  });
};
