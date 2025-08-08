import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const TYPE_COLORS = {
    SUPPORT: "#6366F1",
    ISSUE: "#F43F5E",
    CHANGE_REQUEST: "#10B981"
};

const labelMap = {
    SUPPORT: "Support",
    ISSUE: "Issue",
    CHANGE_REQUEST: "Change Request"
};

const TicketTypeChart = ({ endpoint }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8080${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const chartData = [
                { name: "SUPPORT", value: res.data.support },
                { name: "ISSUE", value: res.data.issue },
                { name: "CHANGE_REQUEST", value: res.data.changeRequest }
            ].filter(d => d.value > 0);

            setData(chartData);
        };

        fetchData();
    }, [endpoint]);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow w-full max-w-3xl mx-auto mt-6 text-center text-gray-500">
                No risk level data available.
            </div>
        );
    }


    return (
        <div className="bg-white p-6 rounded-2xl shadow w-full max-w-3xl mx-auto mt-6">
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${labelMap[name]}: ${value}`}
                    >
                        {data.map(entry => (
                            <Cell key={entry.name} fill={TYPE_COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} tickets`} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


export default TicketTypeChart;
