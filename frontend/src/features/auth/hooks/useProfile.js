import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, getProfiles } from "../api/user";

export const useProfiles = (params = {}) => {
    return useQuery({
        queryKey: ["profiles", params],
        queryFn: () => getProfiles(params),
    });
};

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
