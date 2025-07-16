import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination.jsx";
import BackButton from "./BackButton.jsx";
import TicketTable from "./TicketTable.jsx";
import { closeTicket, deleteTicket } from "../lib/ticketActions.jsx";
import ConfirmModal from "./ConfirmModal.jsx";






function TicketTableLayout({ title, fetchURLBase, showEdit = false, showRisk = false, defaultTab = "open" }) {
    const [tab, setTab] = useState(defaultTab === "closed" ? "closed" : "open");

    const [pagination, setPagination] = useState({
        open: { page: 0, totalPages: 1, totalCount: 0 },
        closed: { page: 0, totalPages: 1, totalCount: 0 }
    });

    const [editModal, setEditModal] = useState({ show: false, ticket: null });
    const [openBackendSortField, setOpenBackendSortField] = useState("createdAt");
    const [closedBackendSortField, setClosedBackendSortField] = useState("closedOn");


    const [tickets, setTickets] = useState({
        open: [],
        closed: []
    });

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        ticketId: null,
        action: null, // close or delete
    });







    const [pageSize] = useState(10);


    useEffect(() => {
        const token = localStorage.getItem("token");

        ["open", "closed"].forEach((type) => {
            axios
                .get(`${fetchURLBase}/${type}?page=0&size=1`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => {
                    setPagination((prev) => ({
                        ...prev,
                        [type]: {
                            ...prev[type],
                            totalCount: res.data.totalElements || 0
                        }
                    }));
                })
                .catch((err) => console.error(`Failed to fetch ${type} count`, err));
        });
    }, [fetchURLBase]);

    const [openSortField, setOpenSortField] = useState("createdAt");
    const [openSortOrder, setOpenSortOrder] = useState("asc");

    const [closedSortField, setClosedSortField] = useState("closedOn");
    const [closedSortOrder, setClosedSortOrder] = useState("desc");

    const toggleSort = (field, isOpen, backendField = field) => {
        if (isOpen) {
            setOpenSortField(field);
            setOpenBackendSortField(backendField);
            setOpenSortOrder(prev => (openSortField === field && openSortOrder === "asc" ? "desc" : "asc"));
        } else {
            setClosedSortField(field);
            setClosedBackendSortField(backendField);
            setClosedSortOrder(prev => (closedSortField === field && closedSortOrder === "asc" ? "desc" : "asc"));
        }
    };






    useEffect(() => {
        const token = localStorage.getItem("token");
        const currentPage = pagination[tab]?.page ?? 0;

        const sortField = tab === "open" ? openBackendSortField : closedBackendSortField;
        const sortOrder = tab === "open" ? openSortOrder : closedSortOrder;
        let url = `${fetchURLBase}/${tab}?page=${currentPage}&size=${pageSize}`;
        if (tab === "closed") {
            url += `&sortField=${closedBackendSortField}&sortOrder=${closedSortOrder}`;
        } else {
            url += `&sort=${openBackendSortField},${openSortOrder}`;
        }



        axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                let fetchedTickets = res.data.content;

                setTickets((prev) => ({ ...prev, [tab]: fetchedTickets }));
                setPagination((prev) => ({
                    ...prev,
                    [tab]: {
                        ...prev[tab],
                        totalPages: res.data.totalPages || 1,
                        totalCount: res.data.totalElements || 0
                    }
                }));
            })
            .catch((err) => console.error(`Error fetching ${tab} tickets:`, err));
        }, [
            tab,
            pagination[tab].page,
            pageSize,
            fetchURLBase,
            openBackendSortField,
            openSortOrder,
            closedBackendSortField,
            closedSortOrder
        ]);



    const handleClose = (ticketId) => {
        const token = localStorage.getItem("token");

        closeTicket(ticketId, fetchURLBase, token, () => {
            setTickets((prev) => ({
                ...prev,
                open: prev.open.filter((t) => t.id !== ticketId)
            }));

            setPagination((prev) => ({
                ...prev,
                open: { ...prev.open, totalCount: prev.open.totalCount - 1 },
                closed: { ...prev.closed, totalCount: prev.closed.totalCount + 1 }
            }));
        });
    };

    const handleDelete = (ticketId) => {
        const token = localStorage.getItem("token");

        deleteTicket(ticketId, fetchURLBase, token, () => {
            setTickets((prev) => ({
                ...prev,
                closed: prev.closed.filter((t) => t.id !== ticketId)
            }));

            setPagination((prev) => ({
                ...prev,
                closed: { ...prev.closed, totalCount: prev.closed.totalCount - 1 }
            }));
        });
    };






    return (
        <div className="fixed inset-0 top-[64px] overflow-hidden">
            <div className="h-full overflow-y-auto scroll-container p-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                    <BackButton />

                    <div className="flex justify-center gap-4 my-6">
                        {["open", "closed"].map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    setTab(type);
                                    setPagination((prev) => ({
                                        ...prev,
                                        [type]: {
                                            ...prev[type],
                                            page: 0
                                        }
                                    }));
                                }}
                                className={`px-5 py-2 rounded-full font-medium transition ${
                                    tab === type
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {type === "open" ? "Open Tickets" : "Closed Tickets"}
                                <span className="ml-2 text-sm bg-white/20 rounded-full px-2 py-0.5">
                                    {pagination[type].totalCount}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="rounded-xl shadow bg-white p-6">

                        <TicketTable
                            tickets={tickets[tab]}
                            isOpenTab={tab === "open"}
                            showEdit={showEdit}
                            onEditTicket={(ticketId) =>
                                setEditModal({
                                    show: true,
                                    ticket: tickets[tab].find((t) => t.id === ticketId),
                                })
                            }

                            showRisk={showRisk}
                            onCloseTicket={(id) => setConfirmModal({ show: true, ticketId: id, action: "close" })}
                            onDeleteTicket={(id) => setConfirmModal({ show: true, ticketId: id, action: "delete" })}
                            sortField={tab === "open" ? openSortField : closedSortField}
                            sortOrder={tab === "open" ? openSortOrder : closedSortOrder}
                            toggleSort={toggleSort}
                        />



                    </div>

                    <div className="min-h-[56px] mb-50px flex items-center justify-center">
                        {pagination[tab].totalPages > 0 && (
                            <Pagination
                                page={pagination[tab].page}
                                totalPages={pagination[tab].totalPages}
                                setPage={(newPage) =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        [tab]: {
                                            ...prev[tab],
                                            page: newPage
                                        }
                                    }))
                                }
                            />
                        )}
                    </div>

                    <ConfirmModal
                        visible={confirmModal.show}
                        title={
                            confirmModal.action === "close"
                                ? "Close Ticket"
                                : confirmModal.action === "delete"
                                    ? "Delete Ticket"
                                    : "Are you sure?"
                        }
                        message={`Are you sure you want to ${confirmModal.action} ticket #${confirmModal.ticketId}?`}
                        onConfirm={() => {
                            if (confirmModal.action === "close") handleClose(confirmModal.ticketId);
                            else if (confirmModal.action === "delete") handleDelete(confirmModal.ticketId);
                            setConfirmModal({ show: false, ticketId: null, action: null });
                        }}
                        onCancel={() => setConfirmModal({ show: false, ticketId: null, action: null })}
                    />

                    {editModal?.show && (
                        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-semibold mb-4 text-center">Edit Ticket</h3>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const token = localStorage.getItem("token");

                                        axios
                                            .put(`http://localhost:8080/admin/tickets/${editModal.ticket.id}/edit`, {
                                                title: e.target.title.value,
                                                description: e.target.description.value,
                                                type: e.target.type.value,
                                                status: e.target.status.value,
                                            }, {
                                                headers: { Authorization: `Bearer ${token}` },
                                            })
                                            .then(() => {
                                                window.location.reload();
                                            })
                                            .catch((err) => {
                                                console.error("Edit failed:", err);
                                                alert("Failed to update ticket");
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
                                        <button
                                            type="submit"
                                            className="bg-green-200 text-green-800 px-6 py-3 rounded-xl shadow hover:bg-green-300 transition"
                                        >
                                            Update
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditModal({ show: false, ticket: null })}
                                            className="bg-red-200 text-red-800 px-6 py-3 rounded-xl shadow hover:bg-red-300 transition"
                                        >
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

export default TicketTableLayout;
