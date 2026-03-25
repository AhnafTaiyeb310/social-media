import api from "@/lib/axios";

export const getMe = async () => {
    const res = await api.get("/profile/me/");
    return res.data;
};
