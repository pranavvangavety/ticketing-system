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

const STATUS_COLORS = {
    OPEN: "#3B82F6",
    IN_PROGRESS: "#F59E0B",
    IN_QUEUE: "#6366F1",
    ON_HOLD: "#EC4899",
    CLOSED: "#10B981"
};

const TicketStatusChart = ({ endpoint }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8080${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const chartData = [
                { name: "OPEN", value: res.data.openTickets },
                { name: "IN_PROGRESS", value: res.data.inProgressTickets },
                { name: "IN_QUEUE", value: res.data.inQueueTickets },
                { name: "ON_HOLD", value: res.data.onHoldTickets },
                { name: "CLOSED", value: res.data.closedTickets }
            ].filter(d => d.value > 0);

            setData(chartData);
        };

        fetchData();
    }, [endpoint]);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow w-full max-w-3xl mx-auto mt-6 text-center text-gray-500">
                No data available.
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
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {data.map(entry => (
                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} tickets`} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TicketStatusChart;
