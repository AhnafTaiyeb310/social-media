import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@/features/auth/hooks/useSocialLogin";

export default function GoogleBtn() {
    const { mutate: login } = useGoogleLogin();

    return (
    <GoogleLogin
        onSuccess={(res) => {
        login(res.credential);
        }}
        onError={() => console.log("Login Failed")}
    />
    );
}
