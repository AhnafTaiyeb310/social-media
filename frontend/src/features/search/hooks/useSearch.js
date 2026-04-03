import { useQuery } from '@tanstack/react-query';
import { globalSearch } from '../api/searchApi';

export const useGlobalSearch = (query) => {
  return useQuery({
    queryKey: ['global-search', query],
    queryFn: () => globalSearch(query),
    enabled: query.length >= 2, // Only search if query is at least 2 chars
    staleTime: 1000 * 60, // 1 minute
  });
};
