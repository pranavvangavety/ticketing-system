import React from "react";
import {useNavigate} from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Welcome, admin</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button onClick={() => navigate("/create-ticket")} className="bg-green-200 text-green-800 px-6 py-4 rounded-xl shadow hover:bg-green-200 transition text-center"> Create Ticket</button>
                <button onClick={() => navigate("/admin/tickets")} className="bg-blue-200 text-blue-800 px-6 py-4 rounded-xl shadow hover:bg-blue-200 transition text-center">View Tickets</button>
                <button onClick={() => navigate("/admin/users")} className="bg-purple-200 text-purple-800 px-6 py-4 rounded-xl shadow hover:bg-purple-200 transition text-center">View Users</button>
            </div>

        </div>
    )
}

export default AdminDashboard;