import React from "react";
import { ArrowDownUp, ChevronUp, ChevronDown } from "lucide-react";

export function renderSortButtons(currentField, currentOrder, isOpenTab, toggleSort) {
    const fields = [
        { key: "id", label: "Ticket ID", entityField: "id" },
        { key: "createdAt", label: "Created At", entityField: "createdAt" },
        { key: "lastUpdated", label: "Last Updated", entityField: "lastupdated" },
    ];

    if (!isOpenTab) {
        fields.push({ key: "riskLevel", label: "Risk Level", entityField: "risk" });
    }


    return (
        <div className="flex gap-2 flex-wrap justify-end mx-4">
            {fields.map(({ key, label , entityField}) => (
                <button
                    key={key}
                    onClick={() => toggleSort(key, isOpenTab, entityField)}

                    className={`flex items-center gap-1 text-sm px-4 py-2 rounded-full border hover:bg-gray-100 transition ${
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


export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}


export function sortTickets(tickets, field, order) {
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


export function downloadCSV(data, filename, fieldMap) {
    if (!data.length) return;

    const availableFields = Object.keys(fieldMap).filter(key => key in data[0]);
    const headerRow = availableFields.map(key => fieldMap[key]).join(",");

    const dataRows = data.map(row =>
        availableFields.map(key => {
            const value = row[key];
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


export function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        year: "2-digit",
        minute: "2-digit",
        hour12: false
    });

}


