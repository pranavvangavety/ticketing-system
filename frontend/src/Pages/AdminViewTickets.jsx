import React, {useState, useEffect} from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";
import TicketActionsDropdown from "../components/TicketActionsDropdown.jsx";
import { Download, ArrowDownUp, ChevronUp, ChevronDown } from "lucide-react";



function AdminViewTickets() {

    const [openTickets, setOpenTickets] = useState([]);
    const [closedTickets, setClosedTickets] = useState([]);
    const [toast, setToast] = useState({message: '', type: ''});
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        ticketId: null,
    });
    const [editModal, setEditModal] = useState({
        show: false,
        ticket: null,
    })
    const [deleteModal, setDeleteModal] = useState({
        show:false,
        ticketId:null,
    });
    const [tab, setTab] = useState("open");

    const [page, setPage] = useState(0); // zero-based
    const [pageSize] = useState(10); // static for now
    const [totalPages, setTotalPages] = useState(1);


    const [openSortField, setOpenSortField] = useState("createdAt");
    const [openSortOrder, setOpenSortOrder] = useState("desc");

    const [closedSortField, setClosedSortField] = useState("closedOn");
    const [closedSortOrder, setClosedSortOrder] = useState("desc");

    function sortTickets(tickets, field, order) {
        return [...tickets].sort((a, b) => {
            const aVal = a[field];
            const bVal = b[field];

            if (!aVal || !bVal) return 0;

            const isDateField = ["createdAt", "lastUpdated", "closedOn"].includes(field);
            if (isDateField) {
                const aTime = new Date(aVal).getTime();
                const bTime = new Date(bVal).getTime();
                return order === "asc" ? aTime - bTime : bTime - aTime;
            }

            if (field === "riskLevel") {
                const levelMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                const aLevel = levelMap[aVal] || 0;
                const bLevel = levelMap[bVal] || 0;
                return order === "asc" ? aLevel - bLevel : bLevel - aLevel;
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

        if (!isOpenTab) {
            fields.push({ key: "riskLevel", label: "Risk Level" });
        }

        return (
            <div className="flex gap-2 flex-wrap justify-end mb-4">
                {fields.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => toggleSort(key, isOpenTab)}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border hover:bg-gray-100 transition ${
                            currentField === key
                                ? "border-blue-500 text-blue-600 font-medium bg-blue-50"
                                : "border-gray-300 text-gray-600"
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

        axios.put(`http://localhost:8080/admin/tickets/${confirmModal.ticketId}/close`, {}, {
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


    function handleDelete(ticketID) {
        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:8080/admin/tickets/${ticketID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                setToast({message: "Ticket Deleted Successfully!", type: "success"});
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch((err) => {
                console.error("Error deleting ticket:", err);
                setToast({message: "Failed to delete ticket", type: "error"});
                setTimeout(() => setToast({message: "", type: ""}), 2000);
            });
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tabEndpoint = tab === "open" ? "open" : "closed";

        axios.get(`http://localhost:8080/admin/tickets/${tabEndpoint}?page=${page}&size=${pageSize}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const data = res.data.content || [];
                if (tab === "open") setOpenTickets(data);
                else setClosedTickets(data);

                setTotalPages(res.data.totalPages || 1);
            })
            .catch((err) => {
                console.error("Tickets error: ", err);
            });
    }, [tab, page]); // rerun when tab or page changes


    function convertToCSV(data) {
        const headers = Object.keys(data[0]).filter(key => typeof data[0][key] !== 'object');
        const csvRows = [
            headers.join(","), // header row
            ...data.map(row =>
                headers.map(fieldName =>
                    JSON.stringify(row[fieldName] ?? "")
                ).join(",")
            )
        ];
        return csvRows.join("\n");
    }

    function downloadCSV(data, filename) {
        if (!data.length) return;

        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", filename);
        a.click();
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

        if (!isOpenTab) {
            fields.push({ key: "riskLevel", label: "Risk Level" });
        }

        return (
            <div className="flex gap-2 flex-wrap justify-end mb-4">
                {fields.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => toggleSort(key, isOpenTab)}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border hover:bg-gray-100 transition ${
                            currentField === key
                                ? "border-blue-500 text-blue-600 font-medium bg-blue-50"
                                : "border-gray-300 text-gray-600"
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


            <h2 className="font-bold text-gray-800 text-center justify-items text-xl">View Tickets</h2>

            <BackButton />

            <div className="flex justify-center gap-4 my-6">
                <button
                    onClick={() => {
                        setTab("open");
                        setPage(0);
                    }}

                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                        tab === "open" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                >
                    Open Tickets
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        tab === "open" ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                    }`}>
                        {openTickets.length}
                    </span>
                </button>

                <button
                    onClick={() => {
                        setTab("closed");
                        setPage(0);
                    }}

                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                        tab === "closed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                >
                    Closed Tickets
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        tab === "closed" ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                    }`}>
                        {closedTickets.length}
                    </span>
                </button>
            </div>



            {tab === "open" && (
                <>
                    <h3 className="text-xl font-semibold mb-4">Open Tickets</h3>
                    {openTickets.length === 0 ? (
                        <p className="text-gray-500">No open tickets</p>
                    ) : (

                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto rounded-lg shadow">

                            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                                <div>
                                    {renderSortButtons(openSortField, openSortOrder, true)}
                                </div>

                                <button
                                    onClick={() => downloadCSV(openTickets, "open_tickets.csv")}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full shadow transition"
                                >
                                    <Download size={16} />
                                    Download CSV
                                </button>
                            </div>


                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="sticky top-0 bg-gray-100 z-10 text-xs uppercase font-semibold text-gray-600">

                                <tr>
                                    <th className="px-4 py-3 ">Ticket ID</th>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3 ">Type</th>
                                    <th className="px-4 py-3 ">Title</th>
                                    <th className="px-4 py-3 ">Description</th>
                                    <th className="px-4 py-3 ">Created At</th>
                                    <th className="px-4 py-3 ">Last Updated</th>
                                    <th className="px-4 py-3 ">Status</th>
                                    <th className="px-4 py-3 "></th>
                                </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-200">

                                {sortTickets(openTickets, openSortField, openSortOrder).map((ticket) => (

                                    <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                        <td className="px-4 py-2 font-medium text-blue-600">#{ticket.id}</td>
                                        <td className="px-4 py-2">{ticket.createdBy}</td>
                                        <td className="px-4 py-2">
                                          <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                                            ${ticket.type === "SUPPORT"
                                              ? "bg-blue-100 text-blue-800"
                                              : ticket.type === "ISSUE"
                                                  ? "bg-red-100 text-red-700"
                                                  : ticket.type === "CHANGE_REQUEST"
                                                      ? "bg-purple-100 text-purple-800"
                                                      : "bg-gray-100 text-gray-600"
                                          }`}>
                                            {ticket.type.replace("_", " ")}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2">{ticket.title}</td>
                                        <td className="px-4 py-2">{ticket.description}</td>
                                        <td className="px-4 py-2">{formatDate(ticket.createdAt)}</td>
                                        <td className="px-4 py-2">{formatDate(ticket.lastUpdated)}</td>
                                        <td className="px-4 py-2">
                                          <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap 
                                          ${ticket.status === "OPEN"
                                                  ? "bg-green-100 text-green-800"
                                                  : ticket.status === "IN_QUEUE"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : ticket.status === "IN_PROGRESS"
                                                          ? "bg-blue-100 text-blue-800"
                                                          : ticket.status === "ON_HOLD"
                                                              ? "bg-orange-100 text-orange-800"
                                                              : ticket.status === "CLOSED"
                                                                  ? "bg-gray-200 text-gray-700"
                                                                  : "bg-gray-100 text-gray-600"
                                          }`}>
                                            {ticket.status.replace("_", " ")}
                                          </span>

                                        </td>
                                        <td className="px-4 py-2">
                                            <TicketActionsDropdown ticketId = {ticket.id}
                                                                   isClosed={false}
                                                                   onClose={(id) => setConfirmModal({show:true, ticketId: id})}

                                                                   onEdit={(ticketId) => {
                                                                       const ticketToEdit = openTickets.find(t => t.id === ticketId) || closedTickets.find(t => t.id === ticketId);
                                                                       setEditModal({show: true, ticket: ticketToEdit});
                                                                   }}

                                                                   onDelete={(id) => setDeleteModal({show:true, ticketId: id})}/>
                                        </td>

                                    </tr>
                                ))}

                                </tbody>


                            </table>

                        </div>

                    )}

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

                </>
            )}

            {tab === "closed" && (
                <>
                    <h3 className="text-xl font-semibold my-6">Closed Tickets</h3>
                    {closedTickets.length === 0 ? (
                        <p className="text-gray-500">No closed tickets</p>
                    ) : (
                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto rounded-lg shadow">

                            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                                <div>
                                    {renderSortButtons(closedSortField, closedSortOrder, false)}
                                </div>

                                <button
                                    onClick={() => downloadCSV(closedTickets, "closed_tickets.csv")}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full shadow transition"
                                >
                                    <Download size={16} />
                                    Download CSV
                                </button>
                            </div>


                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="sticky top-0 bg-gray-100 z-10 text-xs uppercase font-semibold text-gray-600">

                                <tr>
                                    <th className="px-4 py-3 ">Ticket ID</th>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3 ">Type</th>
                                    <th className="px-4 py-3 ">Title</th>
                                    <th className="px-4 py-3 ">Description</th>
                                    <th className="px-4 py-3 ">Created At</th>
                                    <th className="px-4 py-3 ">Closed On</th>
                                    <th className="px-4 py-3 ">Last Updated</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-center">Risk Level</th>

                                </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-200">

                                {sortTickets(closedTickets, closedSortField, closedSortOrder).map((ticket) => (

                                    <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                        <td className="px-4 py-2 font-medium text-blue-600">#{ticket.id}</td>
                                        <td className="px-4 py-2">{ticket.createdBy}</td>
                                        <td className="px-4 py-2">
                                          <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                                            ${ticket.type === "SUPPORT"
                                              ? "bg-blue-100 text-blue-800"
                                              : ticket.type === "ISSUE"
                                                  ? "bg-red-100 text-red-700"
                                                  : ticket.type === "CHANGE_REQUEST"
                                                      ? "bg-purple-100 text-purple-800"
                                                      : "bg-gray-100 text-gray-600"
                                          }`}>
                                            {ticket.type.replace("_", " ")}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2">{ticket.title}</td>
                                        <td className="px-4 py-2">{ticket.description}</td>
                                        <td className="px-4 py-2">{formatDate(ticket.createdAt)}</td>
                                        <td className="px-4 py-2">{formatDate(ticket.closedOn)}</td>
                                        <td className="px-4 py-2">{formatDate(ticket.lastUpdated)}</td>
                                        <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${ticket.status === "OPEN"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-200 text-gray-700"}`}>
                                    {ticket.status}
                                  </span>
                                        </td>
                                        <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${ticket.riskLevel === "HIGH"
                                      ? "bg-red-100 text-red-700"
                                      : ticket.riskLevel === "MEDIUM"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-700"}`}>
                                    {ticket.riskLevel}
                                  </span>
                                        </td>

                                        <td className="px-4 py-2">
                                            <TicketActionsDropdown ticketId = {ticket.id}
                                                                   isClosed={true}
                                                                   onClose={(id) => setConfirmModal({show:true, ticketId: id})}
                                                                   onEdit={(ticketId) => {
                                                                       const ticketToEdit = openTickets.find(t => t.id === ticketId) || closedTickets.find(t => t.id === ticketId);
                                                                       setEditModal({show: true, ticket: ticketToEdit});
                                                                   }}
                                                                   onDelete={(id) => setDeleteModal({show:true, ticketId: id})}/>
                                        </td>


                                    </tr>
                                ))}

                                </tbody>


                            </table>

                        </div>
                    )}

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



                </>
            )}



        </div>
    );
}

export default AdminViewTickets;