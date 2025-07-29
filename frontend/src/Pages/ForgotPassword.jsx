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
                className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full space-y-6"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-800">Forgot Password</h2>

                <p className="text-sm text-center text-gray-600">
                    Enter your username and registered email. We’ll send you a reset link.
                </p>

                {toast.message && (
                    <div
                        className={`text-sm text-center ${
                            toast.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {toast.message}
                    </div>
                )}

                <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-black rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-base font-medium text-gray-800 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-black rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                    Send Reset Link
                </button>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-sm text-blue-600 hover:underline focus:outline-none"
                    >
                        ← Back to Login
                    </button>
                </div>
            </form>

        </div>
    );
};

export default ForgotPassword;
