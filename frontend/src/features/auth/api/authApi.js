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


