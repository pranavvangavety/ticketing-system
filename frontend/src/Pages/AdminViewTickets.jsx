import React from "react";
import { useSearchParams } from "react-router-dom";
import TicketTableLayout from "../components/TicketTableLayout.jsx";

function AdminViewTickets() {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get("tab"); // 'open' or 'closed'

    return (
        <TicketTableLayout
            title="All Tickets"
            fetchURLBase="http://localhost:8080/admin/tickets"
            role="admin"
            showEdit={true}
            showRisk={true}
            defaultTab={tabParam}
        />
    );
}

export default AdminViewTickets;
