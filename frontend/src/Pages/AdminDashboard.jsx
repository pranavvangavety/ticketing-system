import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, FolderOpen } from "lucide-react";

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

                <button
                    onClick={() => navigate("/create-ticket")}
                    className="group animate-pop-in cursor-pointer bg-teal-50 hover:bg-teal-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-teal-800 px-6 py-6 rounded-2xl shadow-md transform transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center space-y-3"
                >
                    <div className="bg-teal-200 p-3 rounded-full">
                        <Plus className="w-7 h-7 text-teal-800 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-bold text-lg">Create Ticket</span>
                    <span className="text-sm text-teal-700">Start a new support request</span>
                </button>

                <button
                    onClick={() => navigate("/admin/tickets")}
                    className="group animate-pop-in cursor-pointer bg-indigo-50 hover:bg-indigo-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-indigo-800 px-6 py-6 rounded-2xl shadow-md transform transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center space-y-3"
                >
                    <div className="bg-indigo-200 p-3 rounded-full">
                        <FolderOpen className="w-7 h-7 text-indigo-800 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-bold text-lg">View Tickets</span>
                    <span className="text-sm text-indigo-700">Check all submitted issues</span>
                </button>

                <button
                    onClick={() => navigate("/admin/users")}
                    className="group animate-pop-in cursor-pointer bg-amber-50 hover:bg-amber-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-amber-800 px-6 py-6 rounded-2xl shadow-md transform transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center space-y-3"
                >
                    <div className="bg-amber-200 p-3 rounded-full">
                        <Users className="w-7 h-7 text-amber-800 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-bold text-lg">View Users</span>
                    <span className="text-sm text-amber-700">Manage registered accounts</span>
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;
