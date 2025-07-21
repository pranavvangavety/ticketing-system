import React, { useEffect, useState } from "react";
import axios from "../lib/axios.js";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const TicketsOverTimeChart = ({ endpoint }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:8080${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const formatted = res.data.map(item => ({
                    ...item,
                    date: item.date.slice(5)
                }));

                setData(formatted);
            } catch (err) {
                console.error("Chart data fetch failed:", err);
            }
        };

        fetchChartData();
    }, [endpoint]);

    return (
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-md w-full max-w-4xl mx-auto">
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#4B5563', fontSize: 12 }}
                        tickFormatter={(dateStr) => {
                            const d = new Date(dateStr);
                            return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                    />
                    <YAxis allowDecimals={false} tick={{ fill: '#4B5563', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            borderColor: "#d1d5db",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                        formatter={(value) => `${value} tickets`}
                        labelFormatter={(label) => {
                            const d = new Date(label);
                            return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        dot={{ r: 3, stroke: "#3B82F6", strokeWidth: 1, fill: "#ffffff" }}
                        activeDot={{ r: 6, fill: "#3B82F6", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TicketsOverTimeChart;
