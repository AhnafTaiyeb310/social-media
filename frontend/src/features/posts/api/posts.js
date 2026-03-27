import api from "@/lib/axios";

export const getPosts = async (params = {}) => {
    const res = await api.get("/posts/", { params });
    return res.data;
};

export const getFeed = async () => {
    const res = await api.get("/posts/feed/");
    return res.data;
};

export const createPost = async (data) => {
    const res = await api.post("/posts/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const likePost = async (id) => {
    const res = await api.post(`/posts/${id}/like/`);
    return res.data;
};

export const deletePost = async (id) => {
    const res = await api.delete(`/posts/${id}/`);
    return res.data;
};

export const updatePost = async ({ id, data }) => {
    const res = await api.patch(`/posts/${id}/`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const getCategories = async () => {
    const res = await api.get("/posts/categories/");
    return res.data;
};

export const getTags = async () => {
    const res = await api.get("/tags/");
    return res.data;
};
