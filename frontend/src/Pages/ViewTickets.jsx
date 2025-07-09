import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";
import { Download, ArrowDownUp, ChevronDown, ChevronUp } from "lucide-react";
import TicketActionsDropdown from "../components/TicketActionsDropdown.jsx";

function ViewTickets() {
    const [toast, setToast] = useState({ message: "", type: "" });
    const [confirmModal, setConfirmModal] = useState({ show: false, ticketId: null });
    const [tab, setTab] = useState("open");

    const [openTickets, setOpenTickets] = useState([]);
    const [closedTickets, setClosedTickets] = useState([]);

    const [openSortField, setOpenSortField] = useState("createdAt");
    const [openSortOrder, setOpenSortOrder] = useState("desc");

    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);


    const [closedSortField, setClosedSortField] = useState("closedOn");
    const [closedSortOrder, setClosedSortOrder] = useState("desc");

    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => document.body.classList.remove("no-scroll");
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (tab === "open") {
            axios
                .get(`http://localhost:8080/tickets/open?page=${page}&size=${pageSize}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setOpenTickets(res.data.content);
                    setTotalPages(res.data.totalPages || 1);
                })
                .catch((err) => console.error("Open tickets error: ", err));
        } else {
            axios
                .get(`http://localhost:8080/tickets/closed?page=${page}&size=${pageSize}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setClosedTickets(res.data.content);
                    setTotalPages(res.data.totalPages || 1);
                })
                .catch((err) => console.error("Closed tickets error: ", err));
        }
    }, [tab, page]);


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

    function handleClose() {
        const token = localStorage.getItem("token");

        axios
            .put(`http://localhost:8080/tickets/${confirmModal.ticketId}/close`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setToast({ message: "✅ Ticket closed successfully!", type: "success" });
                setConfirmModal({ show: false, ticketId: null });
                setTimeout(() => window.location.reload(), 2000);
            })
            .catch((err) => {
                console.error("Error closing ticket:", err);
                setToast({ message: "❌ Failed to close ticket", type: "error" });
                setTimeout(() => setToast({ message: "", type: "" }), 2000);
            });
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
            riskLevel: "Risk Level"
        };

        const availableFields = Object.keys(fieldMap).filter(key => key in data[0]);

        const headerRow = availableFields.map(key => fieldMap[key]).join(",");

        const dataRows = data.map(row =>
            availableFields.map(key => {
                let val = row[key];
                if (val === null || val === undefined) return "";
                if (typeof val === "string" && val.includes(",")) return `"${val}"`;
                return val;
            }).join(",")
        );

        const csv = [headerRow, ...dataRows].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }


    const sortedOpenTickets = sortTickets(openTickets, openSortField, openSortOrder);
    const sortedClosedTickets = sortTickets(closedTickets, closedSortField, closedSortOrder);

    return (

        <div className="fixed inset-0 top-[64px] bg-gradient-to-b from-white via-blue-50 to-purple-50 overflow-hidden">
            <div className="h-full overflow-y-auto scroll-container p-6">

                <div className="p-6">
                    {toast.message && (
                        <div
                            className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow text-white ${
                                toast.type === "success" ? "bg-green-600" : "bg-red-600"
                            }`}
                        >
                            {toast.message}
                        </div>
                    )}

                    {confirmModal.show && (
                        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
                                <h3 className="text-lg font-semibold mb-4">Close Ticket</h3>
                                <p className="text-sm mb-6">
                                    Are you sure you want to close ticket #{confirmModal.ticketId}?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleClose}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    >
                                        Yes, Close
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({ show: false, ticketId: null })}
                                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Tickets</h2>
                        <BackButton />

                        <div className="flex justify-center gap-4 my-6">
                            {["open", "closed"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setTab(type);
                                        setPage(0);
                                    }}

                                    className={`px-5 py-2 rounded-full font-medium transition ${
                                        tab === type
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {type === "open" ? "Open Tickets" : "Closed Tickets"}
                                    <span className="ml-2 text-sm bg-white/20 rounded-full px-2 py-0.5">
                                {type === "open" ? openTickets.length : closedTickets.length}
                            </span>
                                </button>
                            ))}
                        </div>

                        {tab === "open" && (
                            <>
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                                    <h3 className="text-xl font-semibold text-gray-700">Open Tickets</h3>
                                    <div className="flex gap-4 items-center flex-wrap">
                                        {renderSortButtons(openSortField, openSortOrder, true)}
                                        <button
                                            onClick={() => downloadCSV(sortedOpenTickets, "open_tickets.csv")}
                                            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download CSV
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-xl shadow">
                                    <table className="min-w-full text-sm text-left text-gray-700">
                                        <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3">Ticket ID</th>
                                            <th className="px-4 py-3">Title</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Created At</th>
                                            <th className="px-4 py-3">Last Updated</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {sortedOpenTickets.map((ticket) => (
                                            <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                                                <td className="px-4 py-4 text-blue-600 font-semibold whitespace-nowrap">#{ticket.id}</td>
                                                <td className="px-4 py-4 max-w-xs">
                                                    <div className="line-clamp-3 text-gray-800 text-sm leading-snug">{ticket.title}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold
                                                    ${ticket.type === "SUPPORT"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : ticket.type === "ISSUE"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-purple-100 text-purple-800"}
                                                `}>
                                                    {ticket.type.replace("_", " ")}
                                                </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">{formatDate(ticket.createdAt)}</td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">{formatDate(ticket.lastUpdated)}</td>
                                                <td className="px-4 py-4">
                                                <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold
                                                    ${ticket.status === "OPEN"
                                                    ? "bg-green-100 text-green-800"
                                                    : ticket.status === "IN_PROGRESS"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-200 text-gray-700"}
                                                `}>
                                                    {ticket.status.replace("_", " ")}
                                                </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => setConfirmModal({ show: true, ticketId: ticket.id })}
                                                        className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-full text-sm hover:bg-red-200 transition"
                                                    >
                                                        Close
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {(tab === "open" ? openTickets : closedTickets).length > 0 && (
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

                            </>
                        )}

                        {tab === "closed" && (
                            <>
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                                    <h3 className="text-xl font-semibold text-gray-700">Closed Tickets</h3>
                                    <div className="flex gap-4 items-center flex-wrap">
                                        {renderSortButtons(closedSortField, closedSortOrder, false)}
                                        <button
                                            onClick={() => downloadCSV(sortedClosedTickets, "closed_tickets.csv")}
                                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download CSV
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-xl shadow">
                                    <table className="min-w-full text-sm text-left text-gray-700">
                                        <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3">Ticket ID</th>
                                            <th className="px-4 py-3">Title</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Created At</th>
                                            <th className="px-4 py-3">Closed On</th>
                                            <th className="px-4 py-3">Last Updated</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Risk Level</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {sortedClosedTickets.map((ticket) => (
                                            <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                                                <td className="px-4 py-4 text-blue-600 font-semibold whitespace-nowrap">#{ticket.id}</td>
                                                <td className="px-4 py-4 max-w-xs">
                                                    <div className="line-clamp-3 text-gray-800 text-sm leading-snug">{ticket.title}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold
                                                    ${ticket.type === "SUPPORT"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : ticket.type === "ISSUE"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-purple-100 text-purple-800"}
                                                `}>
                                                    {ticket.type.replace("_", " ")}
                                                </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">{formatDate(ticket.createdAt)}</td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">{formatDate(ticket.closedOn)}</td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">{formatDate(ticket.lastUpdated)}</td>
                                                <td className="px-4 py-4">
                                                <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-700">
                                                    {ticket.status.replace("_", " ")}
                                                </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold
                                                    ${ticket.riskLevel === "HIGH"
                                                    ? "bg-red-100 text-red-700"
                                                    : ticket.riskLevel === "MEDIUM"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-700"}
                                                `}>
                                                    {ticket.riskLevel}
                                                </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {(tab === "open" ? openTickets : closedTickets).length > 0 && (
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


                            </>
                        )}
                    </div>
                </div>


            </div>
        </div>


    );
}

export default ViewTickets;
