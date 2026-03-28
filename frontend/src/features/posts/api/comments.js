import api from "@/lib/axios";

export const getComments = async (postId) => {
    const res = await api.get(`/posts/${postId}/comments/`);
    return res.data;
};

export const createComment = async ({ postId, data }) => {
    const res = await api.post(`/posts/${postId}/comments/`, data);
    return res.data;
};

export const updateComment = async ({ postId, commentId, data }) => {
    const res = await api.patch(`/posts/${postId}/comments/${commentId}/`, data);
    return res.data;
};

export const deleteComment = async ({ postId, commentId }) => {
    const res = await api.delete(`/posts/${postId}/comments/${commentId}/`);
    return res.data;
};

export const likeComment = async ({ postId, commentId }) => {
    const res = await api.post(`/posts/${postId}/comments/${commentId}/like/`);
    return res.data;
};
