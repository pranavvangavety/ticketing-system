import React from "react";

function DashboardCard({ title, subtext, icon: Icon, onClick, color }) {
    const colorMap = {
        teal: {
            bg: "bg-teal-50",
            hoverBg: "hover:bg-teal-100",
            text: "text-teal-800",
            iconBg: "bg-teal-200",
            subtext: "text-teal-700",
        },
        indigo: {
            bg: "bg-indigo-50",
            hoverBg: "hover:bg-indigo-100",
            text: "text-indigo-800",
            iconBg: "bg-indigo-200",
            subtext: "text-indigo-700",
        },
        amber: {
            bg: "bg-amber-50",
            hoverBg: "hover:bg-amber-100",
            text: "text-amber-800",
            iconBg: "bg-amber-200",
            subtext: "text-amber-700",
        },
        purple: {
            bg: "bg-purple-50",
            hoverBg: "hover:bg-purple-100",
            text: "text-purple-800",
            iconBg: "bg-purple-200",
            subtext: "text-purple-700",
        },
        emerald: {
            bg: "bg-emerald-50",
            hoverBg: "hover:bg-emerald-100",
            text: "text-emerald-800",
            iconBg: "bg-emerald-200",
            subtext: "text-emerald-700",
        },
        blue: {
            bg: "bg-blue-50",
            hoverBg: "hover:bg-blue-100",
            text: "text-blue-800",
            iconBg: "bg-blue-200",
            subtext: "text-blue-700",
        },
        yellow: {
            bg: "bg-yellow-50",
            hoverBg: "hover:bg-yellow-100",
            text: "text-yellow-800",
            iconBg: "bg-yellow-200",
            subtext: "text-yellow-700",
        },
        violet: {
            bg: "bg-violet-50",
            hoverBg: "hover:bg-violet-100",
            text: "text-violet-800",
            iconBg: "bg-violet-200",
            subtext: "text-violet-700",
        },
        rose: {
            bg: "bg-rose-50",
            hoverBg: "hover:bg-rose-100",
            text: "text-rose-800",
            iconBg: "bg-rose-200",
            subtext: "text-rose-700",
        }
    };


    const styles = colorMap[color] || colorMap.teal;



    return (
        <button
            onClick={onClick}
            className={`group animate-pop-in cursor-pointer px-6 py-6 rounded-2xl shadow-md transform transition duration-300 hover:-translate-y-1 flex flex-col items-center text-center space-y-3 ${styles.bg} ${styles.hoverBg} ${styles.text}`}
        >
            <div className={`p-3 rounded-full ${styles.iconBg}`}>
                <Icon className={`w-7 h-7 ${styles.text} group-hover:scale-110 transition-transform duration-200`} />
            </div>
            <span className="font-bold text-lg">{title}</span>
            <span className={`text-sm ${styles.subtext}`}>{subtext}</span>
        </button>

    );
}

export default DashboardCard;
