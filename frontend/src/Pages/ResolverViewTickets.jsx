import React from "react";
import { useSearchParams } from "react-router-dom";
import TicketTableLayout from "../components/TicketTableLayout.jsx";

function ResolverViewTickets() {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");

    return (
        <TicketTableLayout
            title="My Created Tickets"
            fetchURLBase="http://localhost:8080/tickets"
            showEdit={false}
            showRisk={true}
            defaultTab={tabParam}
        />
    );
}

export default ResolverViewTickets;
