import React, {useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import successIcon from "../assets/Confirmation.png";

function TicketConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const { ticketId, title, type, createdDateTime, isAdmin } = location.state || {};

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    if (!ticketId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-700">No ticket data found</p>
            </div>
        );
    }

    const dt = new Date(createdDateTime);
    const formatDayWithSuffix = (day) => {
        if (day > 3 && day < 21) return `${day}th`;
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    };

    const day = dt.getDate();
    const month = dt.toLocaleString('default', { month: 'long' });
    const year = dt.getFullYear();
    const date = `${formatDayWithSuffix(day)} ${month}, ${year}`;

    const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false});


    return (
        <div className="flex items-center justify-center bg-gray-100 px-4 py-15">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full text-center animate-fade-in">
                <img
                    src={successIcon}
                    alt="Ticket Created"
                    className="w-24 mx-auto mb-6"
                />

                <h2 className="text-2xl font-semibold text-green-600 mb-4">
                    Ticket Created Successfully!
                </h2>

                <div className="bg-gray-50 rounded-md p-5 text-left text-gray-800 mb-8 space-y-2">
                    <p><span className="font-medium">Ticket ID:</span> {ticketId}</p>
                    <p><span className="font-medium">Category:</span> {type}</p>
                    <p><span className="font-medium">Title:</span> {title}</p>
                    <p><span className="font-medium">Created On:</span> {date}</p>
                    <p><span className="font-medium">At:</span> {time}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate(isAdmin ? "/admin" :"/dashboard")}
                        className="px-5 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Return to Dashboard
                    </button>
                    <button
                        onClick={() => {
                            const role = localStorage.getItem("role");
                            if (role === "ROLE_ADMIN") {
                                navigate("/admin/created-tickets");
                            } else if (role === "ROLE_RESOLVER") {
                                navigate("/resolver/tickets");
                            } else {
                                navigate("/view-tickets");
                            }
                        }}

                        className="px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        View My Tickets
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TicketConfirmation;
