import React, {useState} from "react";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";
import {useNavigate} from "react-router-dom";

function CreateTicket() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                'http://localhost:8080/tickets',
                {
                    title,
                    description,
                    type
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/ticket-confirmation" , {
                state: {
                    ticketId: response.data.id,
                    title: response.data.title,
                    type: response.data.type,
                    createdDateTime: response.data.createdAt
                }
            });
        }catch (error) {
            console.error("Ticket Creation failed:", error);
            if (title || description || type) {
                alert(error.response?.data?.message || "Failed to create ticket")
            }
        }
    }


    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="block bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">

                <BackButton />

                <h2 className="font-semibold text-center p-8 text-2xl">Create Ticket</h2>

                <label htmlFor="title" className="block text-gray-700 font-medium py-1 mb-1">Ticket Title: </label>
               <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="description" className="block text-gray-700 font-medium  py-1 mb-1">Description: </label>
                <textarea
                    id="description"
                    rows="4"
                    cols="40"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-md mb-6 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                />
                <label htmlFor="type" className="block text-gray-700 font-medium py-1 mb-1">Category: </label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md mb-6 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                >
                    <option value="">-- Select Type --</option>
                    <option value="SUPPORT">Support</option>
                    <option value="ISSUE">Issue</option>
                    <option value="CHANGE_REQUEST">Change Request</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
            </form>
        </div>

    );
}

export default CreateTicket;