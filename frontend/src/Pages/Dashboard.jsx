import React, {useState, useEffect} from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    // const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');

    // useEffect(() => {
    //
    //     axios.get('http://localhost:8080/users/test', {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //         .then(response => {
    //             setMessage(response.data);
    //         })
    //         .catch(error => {
    //             console.error("Error fetching protected data: ", error);
    //             setMessage("Access Denied");
    //         });
    // },[token]);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if(storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // const [showDropdown, setShowDropdown] = useState(false);

    return (
    <div>
        <div className="w-full flex flex-col items-center justify-center px-6 py-10">
            <div className="bg-white p-6 rounded shadow w-full justify-center items-center text-center">
                <h2 className="text-xl font-semibold mb-2">Welcome, {username}</h2>
                {/*<p className="text-gray-700">{message}</p>*/}
            </div>
            <div className="px-6 py-8">
                <div className="flex gap-4 flex-wrap mb-6">
                    <button onClick={() => navigate("/create-ticket")}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Ticket</button>
                    <button onClick={() => navigate("/view-tickets")}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Tickets</button>
                </div>
            </div>
        </div>



    </div>

    );
}

export default Dashboard;