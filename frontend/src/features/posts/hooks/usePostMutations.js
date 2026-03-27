import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, updatePost } from "../api/posts";

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updatePost({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
        },
    });
};
