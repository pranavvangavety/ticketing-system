import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";


function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if(storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return(
        <div className="bg-blue-600 text-white px-6 py-3 shadow flex justify-between items-center">
            <h1 className="text-xl font-semibold">Ticketing System</h1>
            <div className="relative">
                <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1 bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 focus:outline-none focus:ring-2">
                    {username}<span>▼</span>
                </button>
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-10">
                        <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                            Account
                        </button>
                        <button onClick={() => {localStorage.removeItem("token");
                            window.location.href = "/";
                        }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;

