import { Link } from 'react-router-dom';
import { GoogleLoginButton } from '../GoogleLogin/GoogleLoginButton';
import { AuthContext } from '../../context/Authcontext';
import { useContext } from 'react';

export function Header() {
   const auth = useContext(AuthContext);
   

    return (
        <header className="w-full border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between shadow-sm">

            {/* 1. Left Side: Brand Logo */}
            <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-[#0066cc]">
                    {/* Logo Icon (SVG) */}
                    <svg className="w-6 h-6 text-[#0d9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    <span className="text-gray-900 font-extrabold tracking-tight">Dcex</span>
                </Link>

                {/* 2. Middle Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                    <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Products
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <Link to="/faq" className="hover:text-gray-900">FAQ</Link>
                    <div className="flex items-center cursor-pointer hover:text-gray-900">
                        Company
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </nav>
            </div>
            {auth?.user ? <button onClick={auth.logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Sign Out</button> : <GoogleLoginButton />}
            
        </header>
    );
}
