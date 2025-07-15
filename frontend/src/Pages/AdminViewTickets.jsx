import React from "react";
import TicketTableLayout from "../components/TicketTableLayout.jsx";

function AdminViewTickets() {
    return (
        <TicketTableLayout
            title="All Tickets"
            fetchURLBase="http://localhost:8080/admin/tickets"
            role="admin"
            showEdit={true}
            showRisk={true}
        />
    );
}

export default AdminViewTickets;
