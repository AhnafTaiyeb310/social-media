import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    getComments, 
    createComment, 
    updateComment, 
    deleteComment, 
    likeComment 
} from "../api/comments";

export const useComments = (postId) => {
    return useQuery({
        queryKey: ["posts", postId, "comments"],
        queryFn: () => getComments(postId),
        enabled: !!postId,
    });
};

export const useCreateComment = (postId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createComment({ postId, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
        },
    });
};

export const useUpdateComment = (postId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, data }) => updateComment({ postId, commentId, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
        },
    });
};

export const useDeleteComment = (postId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId) => deleteComment({ postId, commentId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
        },
    });
};

export const useLikeComment = (postId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId) => likeComment({ postId, commentId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
        },
    });
};
