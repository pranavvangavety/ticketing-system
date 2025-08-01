import React, { useState } from "react";
import axios from "../lib/axios.js";
import BackButton from "../components/BackButton.jsx";
import { MailPlus, Loader2 } from "lucide-react";

function InviteUser() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setToast({ message: "Email is required", type: "error" });
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:8080/admin/invite",
                { email },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setToast({ message: `Invite sent to ${email}`, type: "success" });
            setEmail("");
        } catch (err) {
            console.log("RAW response.data:", err.response?.data);
            const backendMessage = err.response?.data?.message || "Failed to send invite";
            setToast({ message: backendMessage, type: "error" });
        } finally {
            setLoading(false);
            setTimeout(() => setToast({ message: "", type: "" }), 2500);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            {toast.message && (
                <div
                    className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 text-white ${
                        toast.type === "error" ? "bg-red-600" : "bg-green-600"
                    }`}
                >
                    {toast.message}
                </div>
            )}

            <div className="relative flex items-center justify-between mb-6">
                <div className="mt-9 z-10">
                    <BackButton />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 text-center absolute left-1/2 -translate-x-1/2">
                    All Users
                </h2>
            </div>


            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                <MailPlus className="w-4 h-4" /> Send Invite
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default InviteUser;
