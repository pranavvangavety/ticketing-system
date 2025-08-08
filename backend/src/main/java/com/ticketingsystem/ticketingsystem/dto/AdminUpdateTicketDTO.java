package com.ticketingsystem.ticketingsystem.dto;

import com.ticketingsystem.ticketingsystem.model.TicketStatus;
import com.ticketingsystem.ticketingsystem.model.TicketType;

public class AdminUpdateTicketDTO {

    private String title;
    private String description;
    private TicketType type;
    private TicketStatus status;
    private String assignedTo;

    public AdminUpdateTicketDTO(){};

    public AdminUpdateTicketDTO(String title, String description, TicketType type, TicketStatus status, String assignedTo) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.status = status;
        this.assignedTo = assignedTo;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketType getType() {
        return type;
    }

    public void setType(TicketType type) {
        this.type = type;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }
}
