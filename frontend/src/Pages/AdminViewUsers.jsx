import React, {useEffect, useState} from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";


function AdminViewUsers() {
    const [users, setUsers] = useState([]);
    const [toast, setToast] = useState({message: "", type: ""});


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

    return (
        <div className="p-6">
            {toast.message && (
                <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}>
                    {toast.message}
                </div>
            )}

            <h2 className="text-2xl font-bold mb-4 text-center">All Users</h2>

            <BackButton/>

            <div className="overflow-x-auto shadow rounded">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
                        <tr>
                            <th className="px-4 py-3">Employee ID</th>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {users.map((user, index) => (
                        <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                            <td className="px-4 py-2">{user.empid}</td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );

}

export default AdminViewUsers;