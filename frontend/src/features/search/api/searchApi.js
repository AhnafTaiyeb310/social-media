import api from '@/lib/axios';

export const globalSearch = async (query) => {
  const res = await api.get('/global-search/', { params: { q: query } });
  return res.data;
};
