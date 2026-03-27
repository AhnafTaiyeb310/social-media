import { useQuery } from "@tanstack/react-query";
import { getFeed, getPosts } from "../api/posts";

export const useFeed = () => {
    return useQuery({
        queryKey: ["posts", "feed"],
        queryFn: getFeed,
    });
};

export const usePosts = (params) => {
    return useQuery({
        queryKey: ["posts", params],
        queryFn: () => getPosts(params),
    });
};
