import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard.jsx";
import {Smile, FolderOpen, BarChart3, Plus, ChartNoAxesColumn, Inbox} from "lucide-react";

function ResolverDashboard() {
    const role = localStorage.getItem("role");
    // console.log("CURRENT ROLE:", role);

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center px-6 py-12">
            <div className="text-center mb-10 animate-pop-in">
                <h2 className="text-3xl font-bold text-gray-800">Welcome, {username}</h2>
                <p className="text-gray-500 text-base mt-2">Here’s your resolver dashboard</p>
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
                    onClick={() => navigate("/resolver/viewtickets")}
                    color="indigo"
                />

                <DashboardCard
                    title="Assigned Tickets"
                    subtext="View tickets assigned to you"
                    icon={Inbox}
                    onClick={() => navigate("/resolver/tickets")}
                    color="blue"
                />


                <DashboardCard
                    title="Analytics"
                    subtext="View analytics"
                    icon={ChartNoAxesColumn}
                    onClick={() => navigate("/analytics")}
                    color="rose"
                />
            </div>
        </div>
    );
}

export default ResolverDashboard;
