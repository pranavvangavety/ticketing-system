import React from "react";
import TicketTableLayout from "../components/TicketTableLayout.jsx";
import { useParams } from "react-router-dom";


function AdminUserTickets() {
    const { username } = useParams();

    return (
        <TicketTableLayout
            title={`Tickets by ${username}`}
            fetchURLBase={`http://localhost:8080/admin/tickets/${username}`}
            role="admin"
            showEdit={true}
            showRisk={true}
        />
    );
}

export default AdminUserTickets;
