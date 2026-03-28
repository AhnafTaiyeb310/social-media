import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../api/user";

export const useProfile = (username) => {
    return useQuery({
        queryKey: ["profile", username],
        queryFn: () => getProfile(username),
        enabled: !!username,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => updateProfile(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            queryClient.invalidateQueries({ queryKey: ["profile", data.username] });
        },
    });
};
