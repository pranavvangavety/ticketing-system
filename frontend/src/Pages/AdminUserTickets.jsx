import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";
import TicketActionsDropdown from "../components/TicketActionsDropdown.jsx";
import { Download, ArrowDownUp, ChevronUp, ChevronDown } from "lucide-react";

function AdminUserTickets() {
    const { username } = useParams();
    const [tab, setTab] = useState("open");
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: "", type: "" });

    const [openCount, setOpenCount] = useState(0);
    const [closedCount, setClosedCount] = useState(0);

    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);


    const [confirmModal, setConfirmModal] = useState({ show: false, ticketId: null });
    const [editModal, setEditModal] = useState({ show: false, ticket: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, ticketId: null });

    const [openSortField, setOpenSortField] = useState("createdAt");
    const [openSortOrder, setOpenSortOrder] = useState("desc");
    const [closedSortField, setClosedSortField] = useState("closedOn");
    const [closedSortOrder, setClosedSortOrder] = useState("desc");

    useEffect(() => {
        // document.body.classList.add("no-scroll");
        // return () => document.body.classList.remove("no-scroll");
    }, []);


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

    function sortTickets(tickets, field, order) {
        return [...tickets].sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];
            if (!aVal || !bVal) return 0;

            if (["createdAt", "lastUpdated", "closedOn"].includes(field)) {
                return order === "asc" ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
            }

            if (field === "riskLevel") {
                const levels = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                return order === "asc" ? levels[aVal] - levels[bVal] : levels[bVal] - levels[aVal];
            }

            return order === "asc" ? aVal - bVal : bVal - aVal;
        });
    }

    function toggleSort(field, isOpenTab) {
        if (isOpenTab) {
            if (openSortField === field) {
                setOpenSortOrder(openSortOrder === "asc" ? "desc" : "asc");
            } else {
                setOpenSortField(field);
                setOpenSortOrder("asc");
            }
        } else {
            if (closedSortField === field) {
                setClosedSortOrder(closedSortOrder === "asc" ? "desc" : "asc");
            } else {
                setClosedSortField(field);
                setClosedSortOrder("asc");
            }
        }
    }

    function renderSortButtons(currentField, currentOrder, isOpenTab) {
        const fields = [
            { key: "id", label: "Ticket ID" },
            { key: "createdAt", label: "Created At" },
            { key: "lastUpdated", label: "Last Updated" },
        ];
        if (!isOpenTab) fields.push({ key: "riskLevel", label: "Risk Level" });

        return (
            <div className="flex gap-2 flex-wrap justify-end">
                {fields.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => toggleSort(key, isOpenTab)}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border hover:bg-gray-100 transition ${
                            currentField === key ? "border-blue-500 text-blue-600 font-medium bg-blue-50" : "border-gray-300 text-gray-600"
                        }`}
                    >
                        {label}
                        {currentField === key ? (
                            currentOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ArrowDownUp className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                ))}
            </div>
        );
    }

    function downloadCSV(data, filename) {
        if (!data.length) return;

        const fieldMap = {
            id: "Ticket ID",
            title: "Title",
            type: "Type",
            createdAt: "Created At",
            closedOn: "Closed On",
            lastUpdated: "Last Updated",
            status: "Status",
            riskLevel: "Risk Level",
            createdBy: "Username",
        };

        const availableFields = Object.keys(fieldMap).filter(key => key in data[0]);

        const headerRow = availableFields.map(key => fieldMap[key]).join(",");

        const dataRows = data.map(row =>
            availableFields.map(key => {
                let value = row[key];
                if (typeof value === "string" && value.includes(",")) {
                    return `"${value}"`; // escape commas
                }
                return value ?? "";
            }).join(",")
        );

        const csvContent = [headerRow, ...dataRows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        const endpoint = tab === "open"
            ? `/admin/tickets/${username}/open`
            : `/admin/tickets/${username}/closed`;

        axios.get(`http://localhost:8080${endpoint}?page=${page}&size=${pageSize}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                const data = res.data.content || [];
                setTickets(data);
                setTotalPages(res.data.totalPages || 1);
                if (tab === "open") setOpenCount(res.data.totalElements);
                else setClosedCount(res.data.totalElements);
            })
            .catch(() => {
                setToast({ message: "Failed to load tickets", type: "error" });
            })
            .finally(() => setLoading(false));
    }, [tab, username, page, pageSize]);




    function handleClose() {
        const token = localStorage.getItem("token");
        axios.put(`http://localhost:8080/admin/tickets/${confirmModal.ticketId}/close`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setToast({ message: "✅ Ticket closed successfully!", type: "success" });
                setConfirmModal({ show: false, ticketId: null });
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch(() => {
                setToast({ message: "❌ Failed to close ticket", type: "error" });
                setTimeout(() => setToast({ message: "", type: "" }), 2000);
            });
    }

    function handleDelete(ticketID) {
        const token = localStorage.getItem("token");
        axios.delete(`http://localhost:8080/admin/tickets/${ticketID}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setToast({ message: "Ticket Deleted Successfully!", type: "success" });
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch(() => {
                setToast({ message: "Failed to delete ticket", type: "error" });
                setTimeout(() => setToast({ message: "", type: "" }), 2000);
            });
    }

    function handleEditSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        axios.put(`http://localhost:8080/admin/tickets/${editModal.ticket.id}/edit`, {
            title: e.target.title.value,
            description: e.target.description.value,
            type: e.target.type.value,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setToast({ message: "✅ Ticket Updated Successfully", type: "success" });
                setEditModal({ show: false, ticket: null });
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch(() => {
                setToast({ message: "❌ Update Failed", type: "error" });
                setTimeout(() => setToast({ message: "", type: "" }), 2000);
            });
    }

    const sortedOpen = sortTickets(tickets, openSortField, openSortOrder);
    const sortedClosed = sortTickets(tickets, closedSortField, closedSortOrder);
    const sortedTickets = tab === "open" ? sortedOpen : sortedClosed;

    return (

        <div className="fixed inset-0 top-[64px] bg-gradient-to-b from-white via-blue-50 to-purple-50 overflow-hidden">
            <div className="h-full overflow-y-auto p-6 scroll-container">
                <div className="p-6">
                    {toast.message && (
                        <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${
                            toast.type === "error" ? "bg-red-600" : "bg-green-600"
                        }`}>
                            {toast.message}
                        </div>
                    )}

                    <h2 className="text-2xl font-bold mb-2 text-center">
                        Tickets by <span className="text-blue-600">{username}</span>
                    </h2>
                    <BackButton />

                    <div className="flex justify-center gap-4 my-4">
                        {["open", "closed"].map(type => (
                            <button
                                key={type}
                                onClick={() => {
                                    setTab(type);
                                    setPage(0);
                                }}

                                className={`px-4 py-2 rounded flex items-center gap-2 ${
                                    tab === type ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                {type === "open" ? "Open Tickets" : "Closed Tickets"}
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    tab === type ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                                }`}>
                            {type === "open" ? openCount : closedCount}
                        </span>
                            </button>
                        ))}
                    </div>

                    {sortedTickets.length > 0 && (
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                            <h3 className="text-xl font-semibold text-gray-700">
                                {tab === "open" ? "Open Tickets" : "Closed Tickets"}
                            </h3>
                            <div className="flex gap-4 items-center flex-wrap">
                                {renderSortButtons(
                                    tab === "open" ? openSortField : closedSortField,
                                    tab === "open" ? openSortOrder : closedSortOrder,
                                    tab === "open"
                                )}
                                <button
                                    onClick={() => downloadCSV(sortedTickets, `${tab}_tickets.csv`)}
                                    className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700"
                                >
                                    <Download className="w-4 h-4" />
                                    Download CSV
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto shadow rounded-xl">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                            <tr>
                                <th className="px-4 py-3">Ticket ID</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Created At</th>
                                {tab === "closed" && <th className="px-4 py-3">Closed On</th>}
                                <th className="px-4 py-3">Last Updated</th>
                                <th className="px-4 py-3">Status</th>
                                {tab === "closed" && <th className="px-4 py-3">Risk Level</th>}
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {sortedTickets.map(ticket => (
                                <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                                    <td className="px-4 py-2 text-blue-600 font-medium whitespace-nowrap">#{ticket.id}</td>
                                    <td className="px-4 py-2">{ticket.title}</td>
                                    <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        ticket.type === "SUPPORT" ? "bg-blue-100 text-blue-800" :
                                            ticket.type === "ISSUE" ? "bg-red-100 text-red-700" :
                                                "bg-purple-100 text-purple-800"
                                    }`}>
                                        {ticket.type.replace("_", " ")}
                                    </span>
                                    </td>
                                    <td className="px-4 py-2">{formatDate(ticket.createdAt)}</td>
                                    {tab === "closed" && <td className="px-4 py-2">{formatDate(ticket.closedOn)}</td>}
                                    <td className="px-4 py-2">{formatDate(ticket.lastUpdated)}</td>
                                    <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        ticket.status === "OPEN" ? "bg-green-100 text-green-800" :
                                            ticket.status === "IN_QUEUE" ? "bg-yellow-100 text-yellow-800" :
                                                ticket.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                                                    ticket.status === "ON_HOLD" ? "bg-orange-100 text-orange-800" :
                                                        "bg-gray-200 text-gray-700"
                                    }`}>
                                        {ticket.status.replace("_", " ")}
                                    </span>
                                    </td>
                                    {tab === "closed" && (
                                        <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            ticket.riskLevel === "HIGH" ? "bg-red-100 text-red-700" :
                                                ticket.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-green-100 text-green-700"
                                        }`}>
                                            {ticket.riskLevel}
                                        </span>
                                        </td>
                                    )}
                                    <td className="px-4 py-2 text-center relative">
                                        <TicketActionsDropdown
                                            ticketId={ticket.id}
                                            isClosed={ticket.status === "CLOSED"}
                                            onClose={() => setConfirmModal({ show: true, ticketId: ticket.id })}
                                            onEdit={() => setEditModal({ show: true, ticket })}
                                            onDelete={() => setDeleteModal({ show: true, ticketId: ticket.id })}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {sortedTickets.length > 0 && (
                        <div className="flex justify-center items-center gap-3 mt-6">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className={`px-4 py-2 rounded-full transition font-medium text-sm
                ${page === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                ◀ Previous
                            </button>

                            <span className="text-sm text-gray-700 font-semibold tracking-wide">
                        Page <span className="text-blue-600">{page + 1}</span> of <span>{totalPages}</span>
                    </span>

                            <button
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className={`px-4 py-2 rounded-full transition font-medium text-sm
                        ${page + 1 >= totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Next ▶
                            </button>
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

                    {deleteModal.show && (

                        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">

                            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
                                <h3 className="text-lg font-semibold mb-4">Delete Ticket</h3>
                                <p className="text-sm mb-6">Are you sure you want to delete ticket #{deleteModal.ticketId}</p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => {
                                        handleDelete(deleteModal.ticketId);
                                        setDeleteModal({show:false, ticketId: null});
                                    }}
                                            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500"
                                    >
                                        Delete
                                    </button>

                                    <button onClick={() => {
                                        setDeleteModal({show: false, ticketId: null});
                                        setToast({message: "Ticket deletion cancelled", type: "error"});
                                        setTimeout(() => setToast({message: "", type: ""}), 2000);
                                    }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {editModal.show && (
                        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 text-center">Edit Ticket</h3>

                                <form

                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        const token = localStorage.getItem('token');

                                        axios.put(`http://localhost:8080/admin/tickets/${editModal.ticket.id}/edit`, {
                                                title: e.target.title.value,
                                                description: e.target.description.value,
                                                type: e.target.type.value,
                                                status: e.target.status.value,
                                            }, {
                                                headers: {
                                                    Authorization: `Bearer ${token}`,
                                                },
                                            }
                                        )
                                            .then(() => {
                                                setToast({message: "✅ Ticket Updated Successfully", type: "success", });
                                                setEditModal({show:false, ticket: null});
                                                setTimeout(() => window.location.reload(), 2000);
                                            })
                                            .catch((err) => {
                                                console.error("Update error:", err);
                                                setToast({message: " ❌ Update Failed", type:"error"});
                                                setTimeout(() => setToast({message: "", type: ""}), 2000)
                                            });
                                    }}
                                >
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            name="title"
                                            defaultValue={editModal.ticket.title}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            defaultValue={editModal.ticket.description}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Type</label>
                                        <select
                                            name="type"
                                            defaultValue={editModal.ticket.type}
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="SUPPORT">SUPPORT</option>
                                            <option value="ISSUE">ISSUE</option>
                                            <option value="CHANGE_REQUEST">CHANGE_REQUEST</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Status</label>
                                        <select
                                            name="status"
                                            defaultValue={editModal.ticket.status}
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="OPEN">OPEN</option>
                                            <option value="IN_QUEUE">In Queue</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="ON_HOLD">On Hold</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                    </div>


                                    <div className="flex justify-end gap-4">
                                        <button type="submit" className="bg-green-200 text-green-800 px-6 py-4 rounded-xl shadow hover:bg-green-300 transition-colors text-center">
                                            Update
                                        </button>

                                        <button type="button" onClick={() => setEditModal({show:false, ticket:null})} className="bg-red-200 text-red-800 px-6 py-4 rounded-xl shadow hover:bg-red-300 transition text-center">
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>


    );
}



export default AdminUserTickets;
