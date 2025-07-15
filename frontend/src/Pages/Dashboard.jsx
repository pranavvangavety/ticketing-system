import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Smile } from "lucide-react";
import DashboardCard from "../components/DashboardCard.jsx";

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

                <DashboardCard
                    title="Create Ticket"
                    subtext="Submit a new issue or request"
                    icon={Plus}
                    onClick={() => navigate("/create-ticket")}
                    color="teal"
                />

                <DashboardCard
                    title="View Tickets"
                    subtext="Track your past requests"
                    icon={FolderOpen}
                    onClick={() => navigate("/view-tickets")}
                    color="indigo"
                />


            </div>
        </div>
    );
}

export default Dashboard;
