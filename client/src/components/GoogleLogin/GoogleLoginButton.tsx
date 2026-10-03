import { GoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { AuthContext } from '../../context/Authcontext';


export const GoogleLoginButton = () => {
    const auth = useContext(AuthContext);

    const handleLoginSuccess = (credentialResponse:any) => {
        console.log('Login Success:', credentialResponse);
        auth?.login(credentialResponse.credential);
    };

    const handleLoginError = () => {
        console.log('Login Failed');
    };
    return (
        <div className="flex items-center space-x-4">


            <div className="overflow-hidden rounded-md shadow-sm">
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    theme="filled_blue"
                    shape="rectangular"
                    text="signin"
                />
            </div>

        </div>
    );
}

