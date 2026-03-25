import FacebookLogin from "react-facebook-login";
import { useFacebookLogin } from "@/features/auth/hooks/useSocialLogin";

export default function FacebookBtn() {
    const { mutate: login } = useFacebookLogin();

    return (
    <FacebookLogin
        appId="YOUR_APP_ID"
        callback={(res) => login(res.accessToken)}
    />
    );
}
