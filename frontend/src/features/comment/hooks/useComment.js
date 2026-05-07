import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, getComments, updateComment, likeComment } from "../api/commentApi";
import { useAuthStore } from "@/store/useAuthStore";

export const useComments = (postId) => {
  return useQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = (postId) => {
  const queryClient = useQueryClient();
  const user = useAuthStore.getState().user;

  return useMutation({
    mutationFn: (data) => createComment({ postId, data }),
    onMutate: async (newCommentPayload) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', postId, 'comments'] });
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['posts', postId, 'comments']);

      // Optimistically update to the new value
      if (previousComments) {
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          content: newCommentPayload.content,
          parent: newCommentPayload.parent || null,
          author_username: user?.username || 'me',
          author_profile: user?.profile || {},
          created_at: new Date().toISOString(),
          is_liked: false,
          likes_count: 0,
          replies: [],
        };

        queryClient.setQueryData(['posts', postId, 'comments'], (old) => {
          if (!old) return old;

          const addReplyRecursively = (comments) => {
            return comments.map(c => {
              if (c.id === newCommentPayload.parent) {
                return {
                  ...c,
                  replies: [...(c.replies || []), optimisticComment]
                };
              }
              if (c.replies?.length > 0) {
                return {
                  ...c,
                  replies: addReplyRecursively(c.replies)
                };
              }
              return c;
            });
          };

          if (newCommentPayload.parent) {
             if (old.results) {
               return { ...old, results: addReplyRecursively(old.results) };
             }
             if (Array.isArray(old)) return addReplyRecursively(old);
          } else {
             if (old.results) {
               return { ...old, results: [optimisticComment, ...old.results] };
             }
             if (Array.isArray(old)) return [optimisticComment, ...old];
          }
          return old;
        });
      }

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['posts', postId, 'comments'], context.previousComments);
      }
    },
    onSettled: () => {
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
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['posts', postId, 'comments'] });

      const previousComments = queryClient.getQueryData(['posts', postId, 'comments']);

      if (previousComments) {
        const updateCommentLike = (comments) => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              const isLiked = !comment.is_liked;
              return {
                ...comment,
                is_liked: isLiked,
                likes_count: isLiked ? (comment.likes_count || 0) + 1 : Math.max(0, (comment.likes_count || 0) - 1),
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentLike(comment.replies),
              };
            }
            return comment;
          });
        };

        queryClient.setQueryData(['posts', postId, 'comments'], (old) => {
          if (!old) return old;
          if (old.results) {
            return {
              ...old,
              results: updateCommentLike(old.results),
            };
          }
          if (Array.isArray(old)) {
            return updateCommentLike(old);
          }
          return old;
        });
      }

      return { previousComments };
    },
    onError: (err, commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['posts', postId, 'comments'], context.previousComments);
      }
    },
    onSettled: () => {
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
