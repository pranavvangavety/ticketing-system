import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from "../components/BackButton.jsx";
import {useNavigate} from "react-router-dom";
import { FolderOpen, HelpCircle, CheckCircle2 } from "lucide-react";
import TicketsOverTimeChart from "../components/TicketsOverTimeChart";


const AdminAnalytics = () => {
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/admin/analytics/summary', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSummary(response.data);
            } catch (error) {
                console.error('Error fetching analytics summary:', error);
            }
        };

        fetchSummary();
    }, []);

    if (!summary) {
        return(
            <div>
                <BackButton/>

                <div>
                    Unable to Load data. Please try after sometime
                </div>
            </div>

        )
    }

    return (
        <div className="fixed inset-0 top-[64px] bg-gradient-to-b from-white via-blue-50 to-purple-50 overflow-hidden">
            <div className="h-full overflow-y-auto scroll-container px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <BackButton />

                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Analytics Summary</h2>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div
                            onClick={() => navigate("/admin/tickets")}
                            className="cursor-pointer bg-white border-l-8 border-blue-500 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center"
                        >
                            <FolderOpen className="text-blue-500 mb-2" size={32} />
                            <h3 className="text-lg font-semibold text-gray-700">Total Tickets</h3>
                            <p className="text-4xl font-bold text-blue-600">{summary.totalTickets}</p>
                        </div>

                        <div
                            onClick={() => navigate("/admin/tickets?tab=open")}
                            className="cursor-pointer bg-white border-l-8 border-green-500 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center"
                        >
                            <HelpCircle className="text-green-500 mb-2" size={32} />
                            <h3 className="text-lg font-semibold text-gray-700">Open Tickets</h3>
                            <p className="text-4xl font-bold text-green-600">{summary.openTickets}</p>
                        </div>


                        <div
                            onClick={() => navigate("/admin/tickets?tab=closed")}
                            className="cursor-pointer bg-white border-l-8 border-red-500 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center"
                        >
                            <CheckCircle2 className="text-red-500 mb-2" size={32} />
                            <h3 className="text-lg font-semibold text-gray-700">Closed Tickets</h3>
                            <p className="text-4xl font-bold text-red-600">{summary.closedTickets}</p>
                        </div>
                    </div>


                    <div className="bg-white rounded-xl shadow p-6 mt-6 w-full max-w-4xl mx-auto">
                        <TicketsOverTimeChart />
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AdminAnalytics;

