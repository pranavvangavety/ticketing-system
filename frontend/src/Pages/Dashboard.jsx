import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Smile } from "lucide-react";

function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);


    return (
        <div className="w-full flex flex-col items-center justify-center px-6 py-12">

            <div className="text-center mb-10 animate-pop-in">
                <h2 className="text-3xl font-bold text-gray-800">Welcome, {username}</h2>
                <p className="text-gray-500 text-base mt-2">Glad to have you back!</p>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">

                <button
                    onClick={() => navigate("/create-ticket")}
                    className="group animate-pop-in cursor-pointer bg-teal-50 hover:bg-teal-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-teal-800 px-6 py-6 rounded-2xl shadow-md transform transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center space-y-3"
                >
                    <div className="bg-teal-200 p-3 rounded-full">
                        <Plus className="w-7 h-7 text-teal-800 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-bold text-lg">Create Ticket</span>
                    <span className="text-sm text-teal-700">Submit a new issue or request</span>
                </button>


                <button
                    onClick={() => navigate("/view-tickets")}
                    className="group animate-pop-in cursor-pointer bg-indigo-50 hover:bg-indigo-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-indigo-800 px-6 py-6 rounded-2xl shadow-md transform transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center space-y-3"
                >
                    <div className="bg-indigo-200 p-3 rounded-full">
                        <FolderOpen className="w-7 h-7 text-indigo-800 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-bold text-lg">View Tickets</span>
                    <span className="text-sm text-indigo-700">Track your past requests</span>
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
