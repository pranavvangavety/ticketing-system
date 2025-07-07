import React, {useState, useEffect} from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";

function ViewTickets() {

    const [openTickets, setOpenTickets] = useState([]);
    const [closedTickets, setClosedTickets] = useState([]);
    const [toast, setToast] = useState({message: '', type: ''});
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        ticketId: null,
    });


    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

    }

    function handleClose() {

        const token = localStorage.getItem('token');

        axios.put(`http://localhost:8080/tickets/${confirmModal.ticketId}/close`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                setToast({message: "✅ Ticket closed successfully!", type: "success"});
                setConfirmModal({show:false, ticketId: null})
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            })
            .catch((err) => {
                console.error("Error closing ticket:", err);
                setToast({message: "❌ Failed to close ticket", type: "error"});
                setTimeout(() => setToast({message: '', type: ''}), 3000);
            });
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get("http://localhost:8080/tickets/open", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setOpenTickets(res.data.content))
            .catch((err) => console.error("Open tickets error: ", err));

        axios.get("http://localhost:8080/tickets/closed", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setClosedTickets(res.data.content))
            .catch((err) => console.error("Closed tickets error: ", err));

    }, []);


    return(
        <div>

            {toast.message && (
                <div className={`
                    fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white animate-fadeIn
                    ${toast.type === `success` ? `bg-green-600`: 
                    toast.type === `error` ? 'bg-red-600':
                    `bg-gray-800`}   
                `}>
                    {toast.message}
                </div>
            )}

            {confirmModal.show && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">

                        <h3 className="text-lg font-semibold mb-4">Close Ticket</h3>
                        <p className="text-sm mb-6">Are you sure you want to close ticket #{confirmModal.ticketId}</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                                Yes, Close
                            </button>
                            <button onClick={() => setConfirmModal({show: false, ticketId: null})} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <h2 className="font-bold text-gray-800 text-center justify-items text-xl">View Tickets</h2>

            <BackButton />

            <h3 className="text-xl font-semibold mb-4">Open Tickets</h3>

            {openTickets.length === 0 ? (
                <p className="text-gray-500">No open tickets</p>
            ) : (
                <div className="max-h-[500px] overflow-y-auto overflow-x-auto rounded-lg shadow">

                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="sticky top-0 bg-gray-100 z-10 text-xs uppercase font-semibold text-gray-600">

                            <tr>
                                <th className="px-4 py-3 ">Ticket ID</th>
                                <th className="px-4 py-3 ">Title</th>
                                <th className="px-4 py-3 ">Description</th>
                                <th className="px-4 py-3 ">Type</th>
                                <th className="px-4 py-3 ">Created At</th>
                                <th className="px-4 py-3 ">Last Updated</th>
                                <th className="px-4 py-3 ">Status</th>
                                <th className="px-4 py-3 "></th>
                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-200">

                        {openTickets.map((ticket) => (
                            <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                <td className="px-4 py-2 font-medium text-blue-600">#{ticket.id}</td>
                                <td className="px-4 py-2">{ticket.title}</td>
                                <td className="px-4 py-2">{ticket.description}</td>
                                <td className="px-4 py-2">{ticket.type}</td>
                                <td className="px-4 py-2">{formatDate(ticket.createdAt)}</td>
                                <td className="px-4 py-2">{formatDate(ticket.lastUpdated)}</td>
                                <td className="px-4 py-2">{ticket.status}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => setConfirmModal({show: true, ticketId: ticket.id})}
                                            className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition">Close</button>
                                </td>

                            </tr>
                        ))}

                        </tbody>


                    </table>

                </div>
            )}

            <h3 className="text-xl font-semibold my-6">Closed Tickets</h3>
            {closedTickets.length === 0 ? (
                <p className="text-gray-500">No closed tickets</p>
            ) : (
                <div className="max-h-[500px] overflow-y-auto overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="sticky top-0 bg-gray-100 z-10 text-xs uppercase font-semibold text-gray-600">

                        <tr>
                            <th className="px-4 py-3 ">Ticket ID</th>
                            <th className="px-4 py-3 ">Type</th>
                            <th className="px-4 py-3 ">Title</th>
                            <th className="px-4 py-3 ">Description</th>
                            <th className="px-4 py-3 ">Created At</th>
                            <th className="px-4 py-3 ">Closed On</th>
                            <th className="px-4 py-3 ">Last Updated</th>
                            <th className="px-4 py-3 ">Status</th>
                            <th className="px-4 py-3 ">Risk Level</th>

                        </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-200">

                        {closedTickets.map((ticket) => (
                            <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                <td className="px-4 py-2 font-medium text-blue-600">#{ticket.id}</td>
                                <td className="px-4 py-2">{ticket.type}</td>
                                <td className="px-4 py-2">{ticket.title}</td>
                                <td className="px-4 py-2">{ticket.description}</td>
                                <td className="px-4 py-2">{formatDate(ticket.createdAt)}</td>
                                <td className="px-4 py-2">{formatDate(ticket.closedOn)}</td>
                                <td className="px-4 py-2">{formatDate(ticket.lastUpdated)}</td>
                                <td className="px-4 py-2">{ticket.status}</td>
                                <td className="px-4 py-2">{ticket.riskLevel}</td>


                            </tr>
                        ))}

                        </tbody>


                    </table>
                </div>
            )}
        </div>
    );
}

export default ViewTickets;