import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createPost, deletePost, getCategories, getFeed, getPost, getPosts, likePost, updatePost, getTags } from '../api/postApi';
import { useAuthStore } from '@/store/useAuthStore';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  });
};

export const usePost = (id) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });
};

export const useFeed = () => {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get('page');
        return nextPage ? parseInt(nextPage) : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!user,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createPost(data),
    onSuccess: () => {
      // Invalidate both feed and posts to ensure all views are updated
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => likePost(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['post', id] });
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(['post', id]);
      const previousFeed = queryClient.getQueryData(['feed']);
      const previousPosts = queryClient.getQueryData(['posts']);

      const updatePostData = (oldData) => {
        if (!oldData) return oldData;

        // Helper to update a single post object
        const updatePost = (post) => {
          if (post.id === id) {
            const isLiked = !post.is_liked;
            return {
              ...post,
              is_liked: isLiked,
              likes_count: isLiked ? (post.likes_count || 0) + 1 : Math.max(0, (post.likes_count || 0) - 1),
            };
          }
          return post;
        };

        // Handle Infinite Query (pages)
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              results: page.results?.map(updatePost),
            })),
          };
        }

        // Handle Standard Paginated List (results)
        if (oldData.results) {
          return {
            ...oldData,
            results: oldData.results.map(updatePost),
          };
        }

        // Handle Array List
        if (Array.isArray(oldData)) {
          return oldData.map(updatePost);
        }

        // Handle Single Post Object
        if (oldData.id === id) {
          return updatePost(oldData);
        }

        return oldData;
      };

      // Optimistically update to the new value
      if (previousPost) queryClient.setQueryData(['post', id], updatePostData(previousPost));
      if (previousFeed) queryClient.setQueryData(['feed'], updatePostData(previousFeed));
      if (previousPosts) queryClient.setQueryData(['posts'], updatePostData(previousPosts));

      return { previousPost, previousFeed, previousPosts };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, id, context) => {
      if (context?.previousPost) queryClient.setQueryData(['post', id], context.previousPost);
      if (context?.previousFeed) queryClient.setQueryData(['feed'], context.previousFeed);
      if (context?.previousPosts) queryClient.setQueryData(['posts'], context.previousPosts);
    },
    // Always refetch after error or success to make sure the server state is in sync
    onSettled: (data, err, id) => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePost(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
