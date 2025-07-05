import React, {useEffect, useState} from "react";
import axios from "axios";

function Profile({username}) {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect( () => {
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

    if(!profile) {
        return <p>Loading..</p>;
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if(newPassword !== confirmPassword) {
            alert("New passwords do not match");
        }
        const token = localStorage.getItem('token');

        try{
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
        }catch (error){
            alert(error.response?.data?.message || "Error changing password.");
        }

    };

    return(
        <div>
            <h2>My Account</h2>

            <p>Name: {profile.name}</p>
            <p>Username: {profile.username}</p>
            <p>Employee ID: {profile.empid}</p>
            <p>Email ID: {profile.email}</p>

            <button onClick={() => setShowModal(true)}>Change Password</button>
            {showModal && (
                <div>
                        <h2>Change Password</h2>
                        <form onSubmit={handleChangePassword}>
                            <label htmlFor="oldPassword">Old Password: </label>
                            <input
                                type="password"
                                id="oldPassword"
                                placeholder="Enter old passwod"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <label htmlFor="newPassword">New Password: </label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <label htmlFor="confirmPassword">Confirm new Password: </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type = "submit">Submit</button>
                        </form>
                    </div>
            )}

        </div>
    );
}

export default Profile;