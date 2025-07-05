package com.ticketingsystem.ticketingsystem.dto;

import java.util.List;

public class TicketListDTO {

    private List<ViewTicketDTO> openTickets;
    private List<ViewTicketDTO> closedTickets;

    public TicketListDTO(List<ViewTicketDTO> openTickets, List<ViewTicketDTO> closedTickets) {
        this.openTickets = openTickets;
        this.closedTickets = closedTickets;
    }

    public List<ViewTicketDTO> getOpenTickets() {
        return openTickets;
    }

    public List<ViewTicketDTO> getClosedTickets() {
        return closedTickets;
    }
}
