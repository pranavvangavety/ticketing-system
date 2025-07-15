import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, FolderOpen , ClipboardList, ChartNoAxesColumn} from "lucide-react";
import DashboardCard from "../components/DashboardCard.jsx";

function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);


    return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
            <h2 className="text-3xl font-extrabold mb-10 text-gray-800 animate-pop-in">Welcome, Admin</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">

                <DashboardCard
                    title="Create Ticket"
                    subtext="Create a new ticket"
                    icon={Plus}
                    onClick={() => navigate("/create-ticket")}
                    color="emerald"
                />

                <DashboardCard
                    title="View Tickets"
                    subtext="Check all submitted tickets"
                    icon={FolderOpen}
                    onClick={() => navigate("/admin/tickets")}
                    color="blue"
                />

                <DashboardCard
                    title="View Users"
                    subtext="Manage registered users"
                    icon={Users}
                    onClick={() => navigate("/admin/users")}
                    color="yellow"
                />

                <DashboardCard
                    title="View Created Tickets"
                    subtext="Tickets opened by Admin"
                    icon={ClipboardList}
                    onClick={() => navigate("/admin/created-tickets")}
                    color="purple"
                />

                <DashboardCard
                    title="Analytics"
                    subtext="View analytics"
                    icon={ChartNoAxesColumn}
                    onClick={() => navigate("/admin/analytics")}
                    color="rose"
                />


            </div>
        </div>
    );
}

export default AdminDashboard;
