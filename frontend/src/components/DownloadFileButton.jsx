import { Download } from "lucide-react";
import React from "react";

function DownloadButton({ ticketId, fileName }) {
    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tickets/${ticketId}/attachment`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to download");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download error:", err);
            alert("Could not download the file.");
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="relative group p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
        >
            <Download className="w-5 h-5" />
            <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
        Download File
      </span>
        </button>
    );
}

export default DownloadButton;
