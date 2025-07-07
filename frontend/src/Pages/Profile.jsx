import React, {useEffect, useState} from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";

function Profile({username}) {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8080/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch profile: ", error);
            });
    }, []);

    if (!profile) {
        return <p>Loading..</p>;
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
        }
        const token = localStorage.getItem('token');

        try {
            await axios.put("http://localhost:8080/auth/changepass",
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmNewPassword: confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Password changed successfully");
            setShowModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            alert(error.response?.data?.message || "Error changing password.");
        }

    };

    return (
        <div>
            <BackButton/>

            <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-center">My Account</h2>
                <div className="text-lg space-y-1">
                    <p><span className="font-medium">Name: </span> {profile.name}</p>
                    <p><span className="font-medium">Username: </span> {profile.username}</p>
                    <p><span className="font-medium">Employee ID: </span> {profile.empid}</p>
                    <p><span className="font-medium">Email ID: </span> {profile.email}</p>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl"
                        onClick={() => setShowModal(true)}>Change Password
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
                        <button className="absolute top-3 text-gray-500 hover:text-red-500 text-4xl font-bold" onClick={() => setShowModal(false)}>
                            &times;
                        </button>

                        <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

                        <form>

                            <div>
                                <label htmlFor="oldPassword" className="block text-sm font-medium mb-1.5">
                                    Old Password
                                </label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    className="w-full mb-5 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder='Enter old password'
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder='Enter new password'
                                    value={oldPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                    Confirm new Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                                    placeholder='Re-enter new password'
                                    value={oldPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">
                                Submit
                            </button>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}


export default Profile;