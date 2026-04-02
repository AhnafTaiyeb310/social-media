import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createComment, deleteComment, getComments, updateComment, likeComment } from "../api/commentApi"

export const useComments = (postId) => {
  return useQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createComment({ postId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const useLikeComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => likeComment({ postId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
    },
  });
};

export const useUpdateComment = (postId, id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateComment({ postId, commentId: id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
    },
  });
};

export const useDeleteComment = (postId, id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteComment({ postId, commentId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
