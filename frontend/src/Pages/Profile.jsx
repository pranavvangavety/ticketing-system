import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";
import { useNavigate } from "react-router-dom";
import { User, Lock, Trash2, CheckCircle, XCircle } from "lucide-react";

function Profile() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [toast, setToast] = useState({ message: "", type: "" });

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setProfile(res.data))
            .catch(err => console.error("Failed to fetch profile:", err));
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put("http://localhost:8080/auth/changepass", {
                oldPassword,
                newPassword,
                confirmNewPassword: confirmPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setToast({ message: "✅ Password updated", type: "success" });
            setShowModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            alert(err.response?.data?.message || "Error changing password.");
        }
    };

    const handleDeleteAccount = () => {
        const token = localStorage.getItem("token");

        axios.delete("http://localhost:8080/users/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setToast({ message: "✅ Account deleted", type: "success" });
                localStorage.removeItem("token");
                setTimeout(() => navigate("/login"), 2000);
            })
            .catch(() => {
                setToast({ message: "❌ Failed to delete account", type: "error" });
                setTimeout(() => setToast({ message: "", type: "" }), 2000);
            });
    };

    if (!profile) return <p className="text-center pt-12 text-lg text-gray-600">Loading your profile...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
            <BackButton />

            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-6 animate-pop-in">
                <div className="flex items-center gap-3 text-blue-600">
                    <User className="w-6 h-6" />
                    <h2 className="text-2xl font-bold tracking-tight">My Account</h2>
                </div>

                <div className="grid gap-2 text-gray-800 text-base">
                    <p><span className="font-semibold">Name:</span> {profile.name}</p>
                    <p><span className="font-semibold">Username:</span> {profile.username}</p>
                    <p><span className="font-semibold">Employee ID:</span> {profile.empid}</p>
                    <p><span className="font-semibold">Email:</span> {profile.email}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
                    >
                        <Lock size={18} /> Change Password
                    </button>

                    {role !== "ROLE_ADMIN" && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition"
                        >
                            <Trash2 size={18} /> Delete My Account
                        </button>
                    )}
                </div>
            </div>


            {toast.message && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-md text-white ${
                        toast.type === "success" ? "bg-green-600" : "bg-red-600"
                    }`}>
                        {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}


            {showDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center space-y-4 animate-pop-in">
                        <Trash2 className="w-8 h-8 text-red-600 mx-auto" />
                        <h2 className="text-lg font-bold">Confirm Deletion</h2>
                        <p className="text-sm text-gray-600">This action cannot be undone. Do you really want to delete your account?</p>
                        <div className="flex justify-center gap-4 pt-2">
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative animate-pop-in">
                        <button
                            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
                            onClick={() => setShowModal(false)}
                        >
                            &times;
                        </button>

                        <h2 className="text-xl font-semibold mb-6 text-center text-blue-700">Change Password</h2>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Old Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter old password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
