import api from "@/lib/axios";

export const getMe = async () => {
    const res = await api.get("/profile/me/");
    return res.data;
};

export const getSuggestions = async () => {
    const res = await api.get("/profiles/suggestions/");
    return res.data;
};

export const followProfile = async (id) => {
    const res = await api.post(`/profiles/${id}/follow/`);
    return res.data;
};
