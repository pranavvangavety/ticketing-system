import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

function UserActionsDropdown({ user, onDelete, onViewTickets }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>

            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                title="User Actions"
            >
                <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10 animate-pop-in">
                    <button
                        onClick={() => {
                            setOpen(false);
                            onViewTickets(user);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition"
                    >
                        View Tickets
                    </button>

                    <button
                        onClick={() => {
                            setOpen(false);
                            onDelete(user);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus:bg-red-100 transition"
                    >
                        Delete User
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserActionsDropdown;
