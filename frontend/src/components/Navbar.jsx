import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";
import ConfirmModal from "./ConfirmModal.jsx";

function Navbar() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [dropdownWidth, setDropdownWidth] = useState(null);
    const [lastLogin, setLastLogin] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);




    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');
        if (storedUsername) setUsername(storedUsername);
        if (storedRole) setRole(storedRole);

        const storedLastLogin = localStorage.getItem('lastLogin');
        if (storedLastLogin) {
            const date = new Date(storedLastLogin);
            const formatted = new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).format(date);
            setLastLogin(formatted);
        }
    }, []);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        const handleEsc = (event) => {
            if (event.key === "Escape") setShowDropdown(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    useEffect(() => {
        if (showDropdown && buttonRef.current) {
            setDropdownWidth(buttonRef.current.offsetWidth);
        }
    }, [showDropdown]);

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 shadow-md flex justify-between items-center animate-pop-in">


            <button
                onClick={() => navigate(role === "ROLE_ADMIN" ? "/admin" : "/dashboard")}
                className="text-2xl font-bold tracking-tight hover:text-blue-200 transition-transform duration-150 hover:scale-[1.02]"
            >
                Ticketing System
            </button>

            <div className="flex items-center gap-4">
                <p className="text-xs text-white">
                    Last login: <span className="font-medium">{lastLogin}</span>
                </p>

                <div className="relative" ref={dropdownRef}>
                    <button
                        ref={buttonRef}
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 bg-blue-800 px-3 py-1.5 rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
                    >
                        <div className="w-8 h-8 bg-white text-blue-700 font-bold rounded-full flex items-center justify-center border-2 border-blue-400 shadow-sm">
                            {username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">{username}</span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"}`}
                        />
                    </button>

                    {showDropdown && (
                        <div
                            className="absolute right-0 mt-2 w-48 bg-white text-sm text-gray-800 rounded-xl shadow-lg z-50 border border-gray-200 animate-fade-in-up overflow-hidden"
                            style={{ width: dropdownWidth }}
                        >
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    navigate("/profile");
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition text-left"
                            >
                                <User className="w-4 h-4 text-gray-600" />
                                My Profile
                            </button>

                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    setShowLogoutConfirm(true);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 transition text-left border-t"
                            >
                                <LogOut className="w-4 h-4 text-red-500" />
                                <span className="text-red-600">Logout</span>
                            </button>



                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                visible={showLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={async () => {
                    const token = localStorage.getItem("token");

                    try {
                        if (token) {
                            await fetch("http://localhost:8080/auth/logout", {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}` },
                            });
                        }
                    } catch (err) {
                        console.error("Logout failed:", err);
                    } finally {
                        localStorage.removeItem("token");
                        localStorage.removeItem("username");
                        localStorage.removeItem("role");
                        window.location.href = "/";
                    }
                }}
            />


        </header>
    );
}

export default Navbar;
