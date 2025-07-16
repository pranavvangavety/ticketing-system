package com.ticketingsystem.ticketingsystem.dto;

public class TicketTypeDTO {
    private long support;
    private long issue;
    private long changeRequest;

    public TicketTypeDTO(long support, long issue, long changeRequest) {
        this.support = support;
        this.issue = issue;
        this.changeRequest = changeRequest;
    }

    public long getSupport() {
        return support;
    }

    public long getIssue() {
        return issue;
    }

    public long getChangeRequest() {
        return changeRequest;
    }
}
