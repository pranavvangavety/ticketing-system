import React, { useState } from "react";
import axios from "../lib/axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToast({ message: "", type: "" });

        try {
            await axios.post("/auth/forgot-password", { username, email });
            setToast({ message: "Reset link sent. Please check your email", type: "success" });
            setUsername("");
            setEmail("");
        } catch (err) {
            const msg = err.response?.data || "Something went wrong";
            setToast({ message: msg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl px-8 py-10 max-w-md w-full space-y-6"
            >
                <h1 className="text-3xl font-bold text-center text-indigo-700">Ticketing System</h1>

                <h2 className="text-xl font-semibold text-center text-gray-800">Forgot Password</h2>

                <p className="text-sm text-center text-gray-600">
                    Enter your username and registered email. We’ll send you a reset link.
                </p>

                {toast.message && (
                    <div
                        className={`px-3 py-2 rounded text-sm text-center font-medium border ${
                            toast.type === "success"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-red-100 text-red-700 border-red-300"
                        }`}
                    >
                        {toast.message}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your username"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                    Send Reset Link
                </button>

                <div className="text-center mt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Back to Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
