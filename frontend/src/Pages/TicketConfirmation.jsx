import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import successIcon from "../assets/Confirmation.png";

function TicketConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const {ticketId, title, type, createdDateTime} = location.state || {};

    if(!ticketId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-700"> No ticket data found</p>
            </div>
        );
    }

    const [date, time] = createdDateTime.split("T");

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white border p-8 rounded shadow text-center max-w-md w-full">

                <img
                    src= {successIcon}
                    alt="success"
                    className="mx-auto mb-6 w-20"
                />

                <h2 className="text-xl font-bold mb-6"> Ticket created successfully!</h2>


                <div className="text-left font-mono text-base mb-8">

                    <p><strong>Ticket ID</strong> : {ticketId}</p>
                    <p><strong>Category</strong> : {type}</p>
                    <p><strong>Title</strong> : {title}</p>
                    <p><strong>Created On</strong> : {date}</p>
                    <p><strong>At</strong> : {time}</p>

                </div>

                <div className="flex gap-4 justify-center">
                    <button onClick={() => navigate("/dashboard")}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Return to dashboard
                    </button>

                    <button onClick={() => navigate("/view-tickets")}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        View Tickets
                    </button>
                </div>


            </div>

        </div>

    );

}

export default TicketConfirmation;