import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

interface AuthData {
    email: string,
    name: string,
    picture: string
}

interface AuthContextType {
    user: AuthData | null,
    login: (token: string) => void,
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => {
    const [user, setUser] = useState<AuthData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user_token');
        if (storedUser) {
            try {
                const userData: AuthData = jwtDecode(storedUser);
                setUser(userData);
                console.log('User data loaded from localStorage:', userData);
            } catch (error) {
                console.error('Failed to decode token:', error);
                localStorage.removeItem('user_token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('user_token', token);
        const userData: AuthData = jwtDecode(token);
        setUser(userData);
        console.log('User logged in:', userData);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_token');
    }

    return (
        <AuthContext value={{ user, login, logout, loading }}>
            {children}
        </AuthContext>
    );
}

export { AuthContext };
