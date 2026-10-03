
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { router } from './routes/routes';
import {AuthContextProvider} from './context/Authcontext';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''; 
  const googleClientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      
    </GoogleOAuthProvider>
  );
}

export default App;
