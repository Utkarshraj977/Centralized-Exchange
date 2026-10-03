import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../components/home/Home';
import { Layout } from '../components/Layout';


const About = () => <h1>About Page</h1>;
const Profile = () => <h1>Profile Page</h1>;

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
        ],
    },
]);


