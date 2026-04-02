import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost, getCategories, getFeed, getPost, getPosts, updatePost } from '../api/postApi';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const usePost = (id) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: ()=> getPost(id),
    enabled: !!id,
  });
};

export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  });
};

export const useCreatePost = ()=> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createPost(data),
    onSuccess: ()=> {
      queryClient.invalidateQueries({queryKey: ['posts']});
      queryClient.invalidateQueries({queryKey: ['feed']});
    },
  });
}

export const useUpdatePost = (id)=> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => updatePost(id, data),
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ['post',  id]}),
  });
}

export const useDeletePost = (id)=> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ['post',  id]}),
  });
}
