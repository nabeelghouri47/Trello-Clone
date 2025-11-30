import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { LogOut } from 'react-feather'; 

const Header = () => {
    const { currentUser, logout } = useContext(AuthContext);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const dropdownRef = useRef(null);

    const userName = currentUser?.username || 'Guest User';

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className='bg-[#1d2125] w-100 h-12 p-3 border-b bordered-box flex flex-row justify-between border-b-[#9fadbc29]'>
            <div className="left justify-center items-center flex">
                <h3 className='text-slate-50 font-bold'>Trello Clone</h3>
            </div>
            
            <div className="right flex items-center space-x-4 relative" ref={dropdownRef}>
                <span className='text-white text-sm font-medium hidden sm:inline'>{userName}</span>
                
                <button 
                    onClick={toggleDropdown}
                    className="p-0 border-none bg-transparent cursor-pointer"
                >
                    <img 
                        className='rounded-full h-7 w-7 object-cover border-2 border-white cursor-pointer hover:opacity-80' 
                        src="https://placehold.co/28x28/026AA7/FFFFFF/png?text=U" // Placeholder ya user avatar
                        alt={userName.charAt(0)} 
                    />
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200">
                        <div className="px-3 py-2 text-sm text-gray-500 border-b">
                            Logged in as: <strong>{userName}</strong>
                        </div>
                        
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 hover:text-red-600 transition duration-150"
                        >
                            <LogOut size={16} className="mr-2"/>
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;