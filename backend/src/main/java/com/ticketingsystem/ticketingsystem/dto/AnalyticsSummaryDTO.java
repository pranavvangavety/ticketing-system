package com.ticketingsystem.ticketingsystem.dto;

public class AnalyticsSummaryDTO {

    private long totalTickets;

    private long openTickets;

    private long closedTickets;

    private long inProgressTickets;

    private long inQueueTickets;

    private long onHoldTickets;

    public AnalyticsSummaryDTO(long totalTickets, long openTickets, long closedTickets, long inProgressTickets, long inQueueTickets, long onHoldTickets) {
        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.closedTickets = closedTickets;
        this.inProgressTickets = inProgressTickets;
        this.inQueueTickets = inQueueTickets;
        this.onHoldTickets = onHoldTickets;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(long openTickets) {
        this.openTickets = openTickets;
    }

    public long getClosedTickets() {
        return closedTickets;
    }

    public void setClosedTickets(long closedTickets) {
        this.closedTickets = closedTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public void setInProgressTickets(long inProgressTickets) {
        this.inProgressTickets = inProgressTickets;
    }

    public long getInQueueTickets() {
        return inQueueTickets;
    }

    public void setInQueueTickets(long inQueueTickets) {
        this.inQueueTickets = inQueueTickets;
    }

    public long getOnHoldTickets() {
        return onHoldTickets;
    }

    public void setOnHoldTickets(long onHoldTickets) {
        this.onHoldTickets = onHoldTickets;
    }
}
