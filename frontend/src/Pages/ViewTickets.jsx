import TicketTableLayout from "../components/TicketTableLayout.jsx";

function ViewTickets() {
    return (
        <TicketTableLayout
            title="Your Tickets"
            fetchURLBase="http://localhost:8080/tickets"
            role="USER"
        />
    );
}

export default ViewTickets;
