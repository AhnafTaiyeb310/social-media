import axios from "@/lib/axios";

export const loginRequest = async (data)=> {
  const res = await axios.post("/login/", data);
  return res.data
}

export const getMe = async (data)=> {
  const res = await axios.get("/profile/me/");
  return res.data
}

export const logoutRequest = async (data) => {
  const res = await axios.post("/logout/");
  return res.data;
};

export const signupRequest = async (data) => {
  const res = await axios.post("/register/", data);
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


