import { useQuery } from '@tanstack/react-query';
import { getTvSeries } from '../api/api';
import type { TVSeries } from '../utils/types';

export const useTvSeries = () => {
  return useQuery<TVSeries[]>({
    queryKey: ['tvseries'],
    queryFn: getTvSeries,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
