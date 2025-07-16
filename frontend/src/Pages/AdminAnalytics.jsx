import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from "../components/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import { FolderOpen, HelpCircle, CheckCircle2 } from "lucide-react";
import TicketsOverTimeChart from "../components/TicketsOverTimeChart";
import TicketStatusChart from "../components/TicketStatusChart";
import TicketTypeChart from "../components/TicketTypeChart";
import RiskLevelChart from "../components/RiskLevelChart";

const AdminAnalytics = () => {
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/admin/analytics/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching analytics summary:', error);
            }
        };

        fetchSummary();
    }, []);

    if (!summary) {
        return (
            <div className="p-6">
                <BackButton />
                <p className="text-center text-gray-600 mt-4">Unable to load data. Please try again later.</p>
            </div>
        );
    }

    const cardBase = "cursor-pointer rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.03] transition-all duration-300 p-6 flex flex-col items-center justify-center text-center";

    return (
        <div className="fixed inset-0 top-[64px] bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
            <div className="h-full overflow-y-auto scroll-container px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <BackButton />
                    <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Analytics Dashboard</h2>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div onClick={() => navigate("/admin/tickets")} className={`${cardBase} bg-gradient-to-r from-blue-100 to-blue-50`}>
                            <div className="p-3 rounded-full bg-blue-200 mb-3">
                                <FolderOpen className="text-blue-700 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">Total Tickets</h3>
                            <p className="text-4xl font-extrabold text-blue-700 mt-1">{summary.totalTickets}</p>
                        </div>

                        <div onClick={() => navigate("/admin/tickets?tab=open")} className={`${cardBase} bg-gradient-to-r from-yellow-100 to-green-50`}>
                            <div className="p-3 rounded-full bg-yellow-200 mb-3">
                                <HelpCircle className="text-yellow-700 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">Pending Tickets</h3>
                            <p className="text-4xl font-extrabold text-yellow-700 mt-1">{summary.pendingTickets}</p>
                        </div>

                        <div onClick={() => navigate("/admin/tickets?tab=closed")} className={`${cardBase} bg-gradient-to-r from-red-100 to-red-50`}>
                            <div className="p-3 rounded-full bg-red-200 mb-3">
                                <CheckCircle2 className="text-red-700 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">Closed Tickets</h3>
                            <p className="text-4xl font-extrabold text-red-700 mt-1">{summary.closedTickets}</p>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Tickets Over Time</h3>
                            <TicketsOverTimeChart />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ticket Status Distribution</h3>
                            <TicketStatusChart />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ticket Type Distribution</h3>
                            <TicketTypeChart />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Risk Level Distribution</h3>
                            <RiskLevelChart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
