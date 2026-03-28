import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followProfile } from "../api/user";

export const useFollow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => followProfile(id),
        onSuccess: () => {
            // Invalidate EVERYTHING related to profiles to ensure UI updates instantly
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
        },
    });
};
