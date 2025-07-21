import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from "../components/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import { FolderOpen, HelpCircle, CheckCircle2 } from "lucide-react";
import TicketsOverTimeChart from "../components/TicketsOverTimeChart";
import TicketStatusChart from "../components/TicketStatusChart";
import TicketTypeChart from "../components/TicketTypeChart";
import RiskLevelChart from "../components/RiskLevelChart";
import {downloadAnalyticsCSV} from "../lib/utils.jsx";
import { Download } from "lucide-react";



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
        <div className="fixed inset-0 top-[64px] overflow-hidden">
        <div className="h-full overflow-y-auto scroll-container px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <BackButton />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                        <h2 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
                            Analytics Dashboard
                        </h2>

                        <button
                            onClick={() => downloadAnalyticsCSV(localStorage.getItem("token"))}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all hover:scale-105 active:scale-100"
                        >
                            <Download className="w-4 h-4" />
                            Download CSV
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div onClick={() => navigate("/admin/tickets")} className={`${cardBase} bg-gradient-to-r from-blue-100 to-blue-50`}>
                            <div className="p-3 rounded-full bg-blue-200 mb-3">
                                <FolderOpen className="text-blue-700 w-6 h-6" />
                            </div>
                            <h3 className="text-base font-medium text-gray-600 tracking-wide">Total Tickets</h3>
                            <p className="text-3xl font-bold text-blue-700 mt-1">{summary.totalTickets}</p>
                        </div>

                        <div onClick={() => navigate("/admin/tickets?tab=open")} className={`${cardBase} bg-gradient-to-r from-yellow-100 to-green-50`}>
                            <div className="p-3 rounded-full bg-yellow-200 mb-3">
                                <HelpCircle className="text-yellow-700 w-6 h-6" />
                            </div>
                            <h3 className="text-base font-medium text-gray-600 tracking-wide">Pending Tickets</h3>
                            <p className="text-3xl font-bold text-yellow-700 mt-1">{summary.pendingTickets}</p>
                        </div>

                        <div onClick={() => navigate("/admin/tickets?tab=closed")} className={`${cardBase} bg-gradient-to-r from-red-100 to-red-50`}>
                            <div className="p-3 rounded-full bg-red-200 mb-3">
                                <CheckCircle2 className="text-red-700 w-6 h-6" />
                            </div>
                            <h3 className="text-base font-medium text-gray-600 tracking-wide">Closed Tickets</h3>
                            <p className="text-3xl font-bold text-red-700 mt-1">{summary.closedTickets}</p>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow">

                            <h3 className="text-base font-medium mb-4 text-gray-600 tracking-wide uppercase">Tickets Over Time</h3>
                            <TicketsOverTimeChart endpoint="/admin/analytics/tickets-over-time" />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-base font-medium mb-4 text-gray-600 tracking-wide uppercase">Ticket Status Distribution</h3>
                            <TicketStatusChart endpoint="/admin/analytics/summary "/>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-base font-medium mb-4 text-gray-600 tracking-wide uppercase">Ticket Type Distribution</h3>
                            <TicketTypeChart endpoint="/admin/analytics/type-distribution" />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-base font-medium mb-4 text-gray-600 tracking-wide uppercase">Risk Level Distribution</h3>
                            <RiskLevelChart endpoint="/admin/analytics/risk-distribution" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
