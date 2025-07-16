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

const RISK_COLORS = {
    LOW: "#3B82F6",
    MEDIUM: "#F59E0B",
    HIGH: "#EF4444"
};

const labelMap = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
};

const RiskLevelChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/admin/analytics/risk-distribution', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const chartData = [
                { name: "LOW", value: res.data.low },
                { name: "MEDIUM", value: res.data.medium },
                { name: "HIGH", value: res.data.high }
            ].filter(d => d.value > 0);

            setData(chartData);
        };

        fetchData();
    }, []);

    if (!data) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow w-full max-w-3xl mx-auto mt-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                Risk Level Distribution
            </h2>

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
                            <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} tickets`} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RiskLevelChart;
