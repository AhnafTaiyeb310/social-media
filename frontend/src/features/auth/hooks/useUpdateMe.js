import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/authApi";
import { useAuthStore } from "@/store/useAuthStore";

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: (data) => updateMe(data),
    onSuccess: (data) => {
      // Update global store with fresh data from backend
      setUser(data);
      // Refresh any profile queries
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
};
