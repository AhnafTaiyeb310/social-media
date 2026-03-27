import { useQuery } from "@tanstack/react-query";
import { getSuggestions } from "../api/user";

export const useSuggestions = () => {
    return useQuery({
        queryKey: ["profiles", "suggestions"],
        queryFn: getSuggestions,
    });
};
