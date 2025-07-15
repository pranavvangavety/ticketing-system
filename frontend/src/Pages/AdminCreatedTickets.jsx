import React from "react";
import TicketTableLayout from "../components/TicketTableLayout.jsx";

function AdminCreatedTickets() {
    return (
        <TicketTableLayout
            title="Tickets Created by Admin"
            fetchURLBase="http://localhost:8080/admin/tickets/by-admin"
            role="admin"
            showEdit={true}
            showRisk={true}
        />
    );
}

export default AdminCreatedTickets;
