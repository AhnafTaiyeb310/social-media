import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followProfile } from "../api/user";

export const useFollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => followProfile(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profiles", "suggestions"] });
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
        },
    });
};
