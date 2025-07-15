import React from "react";
import TypeBadge from "./TypeBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";
import RiskLevelBadge from "./RiskLevel.jsx";
import { formatShortDate, sortTickets, renderSortButtons, downloadCSV } from "../lib/utils.jsx";
import { Download } from "lucide-react";




function TicketTable({ tickets, isOpenTab, showEdit, showRisk, onCloseTicket, onDeleteTicket, sortField, sortOrder, toggleSort, onEditTicket }) {

    const sortedTickets = Array.isArray(tickets)
        ? (sortField ? sortTickets(tickets, sortField, sortOrder) : tickets)
        : [];


    const fieldMap = {
        id: "Ticket ID",
        type: "Type",
        title: "Title",
        description: "Description",
        createdAt: "Created At",
        closedOn: "Closed On",
        lastUpdated: "Last Updated",
        status: "Status",
        riskLevel: "Risk Level"
    };

    const columnCount =
        8 +                      // common columns
        (!isOpenTab ? 1 : 0) +   // Closed On
        (!isOpenTab && showRisk ? 1 : 0) +  // Risk Level
        (showEdit ? 1 : 0);      // Edit


    return (

        <div className="overflow-x-auto rounded-xl shadow bg-white">

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h3 className="px-3 text-xl font-semibold text-gray-800">
                    {isOpenTab ? "Open Tickets" : "Closed Tickets"}
                </h3>

                <div className="flex flex-wrap items-center gap-3 justify-end">
                    {renderSortButtons(sortField, sortOrder, isOpenTab, toggleSort)}

                    <button
                        onClick={() =>
                            downloadCSV(sortedTickets, `${isOpenTab ? "open" : "closed"}-tickets.csv`, fieldMap)
                        }
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition"
                    >
                        <Download className="w-4 h-4" />
                        Download CSV
                    </button>
                </div>
            </div>




            <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="sticky top-0 bg-gray-100 z-10 text-xs uppercase font-semibold text-gray-600">
                <tr>
                    <th className="px-4 py-3 text-center">Ticket ID</th>
                    <th className="px-4 py-3 text-center">Type</th>
                    <th className="px-4 py-3 text-center">Title</th>
                    <th className="px-4 py-3 text-center">Description</th>
                    <th className="px-4 py-3 text-center">Created At</th>
                    {!isOpenTab && <th className="px-4 py-3 text-center">Closed On</th>}
                    <th className="px-4 py-3 text-center">Last Updated</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    {showRisk && !isOpenTab && <th className="px-4 py-3 text-center">Risk Level</th>}
                    {showEdit && <th className="px-4 py-3">Edit</th>}
                    <th className="px-4 py-3">Actions</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">

                {sortedTickets.length === 0 ? (
                    <tr>
                        <td colSpan={columnCount} className="text-center py-6 text-gray-500">
                            No tickets to display
                        </td>
                    </tr>
                ): (
                    sortedTickets.map((ticket) => (
                            <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition text-center">
                                <td className="px-4 py-3 font-medium text-blue-600 whitespace-nowrap align-middle h-[56px]">
                                    #{ticket.id}
                                </td>

                                <td className="px-4 py-3 align-middle h-[56px]">
                                    <TypeBadge type={ticket.type} />
                                </td>

                                <td className="px-4 py-3 max-w-xs align-middle h-[56px]">
                                    <div className="line-clamp-2 text-gray-800 text-sm leading-snug">{ticket.title}</div>
                                </td>

                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs align-middle h-[56px]">
                                    <div className="line-clamp-2 leading-snug">{ticket.description}</div>
                                </td>


                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 align-middle h-[56px]">
                                    {(() => {
                                        const [date, time] = formatShortDate(ticket.createdAt).split(", ");
                                        return (
                                            <div className="flex flex-col justify-center leading-tight">
                                                <div>{date}</div>
                                                <div className="text-xs text-gray-500">{time}</div>
                                            </div>
                                        );
                                    })()}
                                </td>


                                {!isOpenTab && (
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 align-middle h-[56px]">
                                        {(() => {
                                            const [date, time] = formatShortDate(ticket.closedOn).split(", ");
                                            return (
                                                <div className=" flex flex-col justify-center leading-tight">
                                                    <div>{date}</div>
                                                    <div className="text-xs text-gray-500">{time}</div>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                )}


                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 align-middle h-[56px]">
                                    {(() => {
                                        const [date, time] = formatShortDate(ticket.lastUpdated).split(", ");
                                        return (
                                            <div className="flex flex-col justify-center leading-tight">
                                                <div>{date}</div>
                                                <div className="text-xs text-gray-500">{time}</div>
                                            </div>
                                        );
                                    })()}
                                </td>

                                <td className="px-4 py-3 align-middle h-[56px]">
                                    <StatusBadge status={ticket.status} />
                                </td>

                                {showRisk && !isOpenTab && (
                                    <td className="px-4 py-3 align-middle h-[56px]">
                                        <RiskLevelBadge riskLevel={ticket.riskLevel} />
                                    </td>
                                )}

                                {showEdit && (
                                    <td className="px-4 py-3 align-middle h-[56px]">
                                        <button
                                            onClick={() => onEditTicket(ticket.id)}

                                            className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full hover:bg-blue-200 transition"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                )}

                                <td className="px-4 py-3 space-x-2 align-middle h-[56px]">
                                    {isOpenTab ? (
                                        <button
                                            onClick={() => onCloseTicket(ticket.id)}
                                            className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full hover:bg-red-200 transition"
                                        >
                                            Close
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onDeleteTicket(ticket.id)}
                                            className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full hover:bg-red-200 transition"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default TicketTable;
