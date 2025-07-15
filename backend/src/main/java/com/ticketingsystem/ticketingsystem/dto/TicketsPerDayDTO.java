package com.ticketingsystem.ticketingsystem.dto;

import java.time.LocalDate;

public class TicketsPerDayDTO {

    private LocalDate date;

    private long count;

    public TicketsPerDayDTO(LocalDate date, long count) {
        this.date = date;
        this.count = count;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
