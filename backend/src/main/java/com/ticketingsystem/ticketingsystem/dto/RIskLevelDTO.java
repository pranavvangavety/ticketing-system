package com.ticketingsystem.ticketingsystem.dto;

public class RIskLevelDTO {

    private long low;
    private long medium;
    private long high;

    public RIskLevelDTO(long low, long medium, long high) {
        this.low = low;
        this.medium = medium;
        this.high = high;
    }

    public long getLow() {
        return low;
    }

    public void setLow(long low) {
        this.low = low;
    }

    public long getMedium() {
        return medium;
    }

    public void setMedium(long medium) {
        this.medium = medium;
    }

    public long getHigh() {
        return high;
    }

    public void setHigh(long high) {
        this.high = high;
    }
}
