import { useQuery } from "@tanstack/react-query";
import { getFeed, getPosts, getPost } from "../api/posts";

export const useFeed = () => {
    return useQuery({
        queryKey: ["posts", "feed"],
        queryFn: getFeed,
    });
};

export const usePost = (id) => {
    return useQuery({
        queryKey: ["posts", id],
        queryFn: () => getPost(id),
        enabled: !!id,
    });
};

export const usePosts = (params) => {
    return useQuery({
        queryKey: ["posts", params],
        queryFn: () => getPosts(params),
    });
};
