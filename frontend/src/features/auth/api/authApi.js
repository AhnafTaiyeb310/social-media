import axios from "@/lib/axios";

export const loginRequest = async (data)=> {
  const res = await axios.post("/auth/login/", data);
  return res.data
}

export const getMe = async (data)=> {
  const res = await axios.get("/profile/me/");
  return res.data
}

export const updateMe = async (data) => {
  const res = await axios.patch("/profile/me/", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const logoutRequest = async (data) => {
  const res = await axios.post("/auth/logout/");
  return res.data;
};

export const signupRequest = async (data) => {
  const res = await axios.post("/auth/registration/", data);
  return res.data;
};

export const googleLoginRequest = async (token) => {
  const res = await axios.post("/auth/google/", { access_token: token });
  return res.data;
};

export const facebookLoginRequest = async (token) => {
  const res = await axios.post("/auth/facebook/", { access_token: token });
  return res.data;
};

export const verifyEmailRequest = async (key) => {
  const res = await axios.post("/auth/registration/verify-email/", { key });
  return res.data;
};

export const getProfile = async (username) => {
  const res = await axios.get(`/profiles/${username}/`);
  return res.data;
};

export const getSuggestions = async () => {
  const res = await axios.get('/profiles/suggestions/');
  return res.data;
};

export const followUser = async (profileId) => {
  const res = await axios.post(`/profiles/${profileId}/follow/`);
  return res.data;
};


