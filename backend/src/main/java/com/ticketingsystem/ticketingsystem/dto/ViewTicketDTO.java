package com.ticketingsystem.ticketingsystem.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ticketingsystem.ticketingsystem.model.*;


import java.time.LocalDateTime;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class ViewTicketDTO {
    private long id;
    private String createdBy;
    private TicketType type;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime closedOn;
    private LocalDateTime lastUpdated;
    private TicketStatus status;
    private RiskLevel riskLevel;


    public ViewTicketDTO(long id, String createdBy, TicketType type, String title, String description,
                         LocalDateTime createdAt, LocalDateTime lastUpdated, TicketStatus status) {
        this.id = id;
        this.createdBy = createdBy;
        this.type = type;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.lastUpdated = lastUpdated;
        this.status = status;
    }


    public ViewTicketDTO(long id, String createdBy, TicketType type, String title, String description,
                         LocalDateTime createdAt, LocalDateTime closedOn, LocalDateTime lastUpdated,
                         TicketStatus status, RiskLevel riskLevel) {
        this.id = id;
        this.createdBy = createdBy;
        this.type = type;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.closedOn = closedOn;
        this.lastUpdated = lastUpdated;
        this.status = status;
        this.riskLevel = riskLevel;
    }



    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public TicketType getType() {
        return type;
    }

    public void setType(TicketType type) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getClosedOn() {
        return closedOn;
    }

    public void setClosedOn(LocalDateTime closedOn) {
        this.closedOn = closedOn;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }


    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }
}





