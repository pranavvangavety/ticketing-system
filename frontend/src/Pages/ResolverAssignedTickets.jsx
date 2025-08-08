import React from "react";
import { useSearchParams } from "react-router-dom";
import TicketTableLayout from "../components/TicketTableLayout.jsx";

function ResolverAssignedTickets() {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");

    return (
        <TicketTableLayout
            title="My Assigned Tickets"
            fetchURLBase="http://localhost:8080/tickets/resolver"
            showEdit={true}
            showRisk={true}
            defaultTab={tabParam || "assigned"}
        />
    );
}

export default ResolverAssignedTickets;
