import api from "@/lib/axios";

export const getMe = async () => {
    const res = await api.get("/profile/me/");
    return res.data;
};

export const getSuggestions = async () => {
    const res = await api.get("/profiles/suggestions/");
    return res.data;
};

export const getProfiles = async (params = {}) => {
    const res = await api.get("/profile/", { params });
    return res.data;
};

export const getProfile = async (username) => {
    const res = await api.get(`/profile/${username}/`);
    return res.data;
};

export const updateProfile = async (data) => {
    const res = await api.patch("/profile/me/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const followProfile = async (id) => {
    const res = await api.post(`/profiles/${id}/follow/`);
    return res.data;
};
