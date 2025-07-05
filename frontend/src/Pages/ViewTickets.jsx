import React, {useState, useEffect} from "react";
import axios from "axios";

function ViewTickets() {

    const [openTickets, setOpenTickets] = useState([]);
    const [closedTickets, setClosedTickets] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get("http://localhost:8080/tickets/open", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setOpenTickets(res.data.content))
            .catch((err) => console.error("Open tickets error: ", err));

        axios.get("http://localhost:8080/tickets/closed", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => setClosedTickets(res.data.content))
            .catch((err) => console.error("Closed tickets error: ", err));

    }, []);



    return(
        <div>
            <h2>View Tickets</h2>
            <h3>Open Tickets</h3>
            {openTickets.length === 0 ? (
                <p>No open Tickets</p>
                ) : (
                    <ul>
                        {openTickets.map((ticket) => (
                            <li key={ticket.id}>
                                #{ticket.id} - {ticket.title} - {ticket.description} - {ticket.type} - {ticket.status}
                            </li>
                        ))}
                    </ul>
                )}

            <h3>Closed Tickets</h3>
            {closedTickets.length === 0 ? (
                <p>No closed tickets</p>
            ) : (
                <ul>
                    {closedTickets.map((ticket) => (
                        <li key={ticket.id}>
                            #{ticket.id} - {ticket.title} - {ticket.type} - {ticket.status} - {ticket.riskLevel}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ViewTickets;