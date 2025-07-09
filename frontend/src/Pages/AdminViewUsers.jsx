import React, {useEffect, useState} from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";
import UserActionsDropdown from "../components/UserActionsDropdown.jsx";
import {useNavigate} from "react-router-dom";


function AdminViewUsers() {
    const [users, setUsers] = useState([]);
    const [toast, setToast] = useState({message: "", type: ""});
    const navigate = useNavigate();
    const [deleteUserModal, setDeleteUserModal] = useState({
        show: false,
        user: null,
    });

    useEffect(() => {
        document.body.classList.add("no-scroll");
        return () => document.body.classList.remove("no-scroll");
    }, []);



    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:8080/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setUsers(res.data.content);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
                setToast({message: "Failed to load list of users", type: "error"});
            });
    }, []);

    function handleDeleteUser() {
        const token = localStorage.getItem("token");
        const username = deleteUserModal.user.username;

        axios
            .delete(`http://localhost:8080/admin/users/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setToast({ message: "✅ User deleted successfully", type: "success" });
                setUsers((prev) => prev.filter((u) => u.username !== username));
                setDeleteUserModal({ show: false, user: null });
            })
            .catch((err) => {
                console.error("Error deleting user:", err);
                setToast({ message: "❌ Failed to delete user", type: "error" });
                setTimeout(() => setToast({ message: "", type: "" }), 2000);
            });
    }



    return (
        <div className="p-6">


            {toast.message && (
                <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
                    {toast.message}
                </div>
            )}


            {deleteUserModal.show && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
                        <h3 className="text-lg font-semibold mb-4">Delete User</h3>
                        <p className="text-sm mb-6">
                            Are you sure you want to delete user <span className="font-bold">{deleteUserModal.user.username}</span>?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDeleteUser}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteUserModal({ show: false, user: null })}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <h2 className="text-2xl font-bold mb-4 text-center">All Users</h2>

            <BackButton/>

            <div className="relative overflow-x-visible shadow rounded">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Employee ID</th>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email ID</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {users.map((user, index) => (
                        <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{user.empid}</td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2 text-center relative">
                                <UserActionsDropdown
                                    user={user}
                                    onDelete={(user) => setDeleteUserModal({ show: true, user })}
                                    onViewTickets={(user) => navigate(`/admin/users/${user.username}/tickets`)}
                                />

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );

}

export default AdminViewUsers;