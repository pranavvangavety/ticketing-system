import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios.js";
import { Loader2 } from "lucide-react";
import PasswordFields from "../components/PasswordFields.jsx";
import {isValidPassword} from "../lib/utils.jsx";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [toast, setToast] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(null); // null = unknown, true = valid, false = invalid


    useEffect(() => {
        if (!token) {
            setToast({ message: "Invalid or missing token.", type: "error" });
            setIsValidToken(false);
            return;
        }

        axios
            .post("/auth/validate-reset-token", { token })
            .then(() => {
                setIsValidToken(true);
            })
            .catch((err) => {
                const msg = err?.response?.data || "Invalid or expired reset token.";
                setToast({ message: msg, type: "error" });
                setIsValidToken(false);
                setTimeout(() => navigate("/"), 3000); // optional redirect
            });
    }, [token, navigate]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return;

        if (!isValidPassword(newPassword)) {
            setToast({ message: "Password does not meet complexity requirements.", type: "error" });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setToast({ message: "Passwords do not match.", type: "error" });
            return;
        }


        setLoading(true);
        try {
            await axios.post("/auth/reset-password", {
                token,
                newPassword,
                confirmNewPassword,
            });
            setToast({ message: "Password successfully reset!", type: "success" });

            setTimeout(() => navigate("/"), 2000); // back to login
        } catch (err) {
            const msg = err.response?.data || "Reset failed";
            setToast({ message: msg, type: "error" });
        } finally {
            setLoading(false);
        }
    };


    if (isValidToken === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
                <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center border border-gray-400">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">Ticketing System</h1>
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Reset Password</h2>
                    <p className="text-red-600 font-medium">Invalid or missing token.</p>
                </div>
            </div>
        );
    }



    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-xl p-8 max-w-md w-full space-y-6 border border-gray-400"
            >
                <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
                <p className="text-sm text-gray-600 text-center mb-2">
                    Enter your new password below.
                </p>

                <PasswordFields
                    oldPassword={""}
                    setOldPassword={() => {}}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmNewPassword}
                    setConfirmPassword={setConfirmNewPassword}
                    showOld={false}
                />

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !isValidPassword(newPassword) ||
                        newPassword !== confirmNewPassword
                    }
                    className={`w-full flex justify-center items-center gap-2 font-semibold py-2 rounded-md transition
                    ${
                        loading ||
                        !isValidPassword(newPassword) ||
                        newPassword !== confirmNewPassword
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                    Reset Password
                </button>


                {toast.message && (
                    <div
                        className={`text-sm text-center ${
                            toast.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {toast.message}
                    </div>
                )}
            </form>
        </div>
    );
};



export default ResetPassword;