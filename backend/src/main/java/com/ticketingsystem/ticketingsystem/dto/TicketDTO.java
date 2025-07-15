package com.ticketingsystem.ticketingsystem.dto;

import com.ticketingsystem.ticketingsystem.model.TicketType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 300, message = "Description must be 10-300 characters long")
    private String description;

    @NotNull(message = "Type is required")
    private TicketType type;

    public TicketDTO(){

    }

    public TicketDTO(String title, String description, TicketType type) {
        this.title = title;
        this.description = description;
        this.type = type;
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
}
