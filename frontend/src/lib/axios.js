import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios"

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});


// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const token = useAuthStore.getState().accessToken;

    if(token)
        config.headers.Authorization = `Bearer ${token}`
    return config;
    }, function (error) {
    return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    res => res,
    async (error) => {
        const request = error.config;
        
        if(error.response?.status !== 401 || request._retry){
            return Promise.reject(error);
        }

        request._retry = true;

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/refresh/`,
                {}, { withCredentials: true }
            )
            const newAccessToken = res.data.access
            useAuthStore.getState().setAccessToken(newAccessToken)

            // retry with new token
            request.headers.Authorization = `Bearer ${newAccessToken}`
            return instance(request)
        } catch (error) {
            // useAuthStore.getState().logout();
            return Promise.reject(error)
        }
    }
)


export default instance;
