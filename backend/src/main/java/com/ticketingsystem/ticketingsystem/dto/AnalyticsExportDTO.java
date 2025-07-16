package com.ticketingsystem.ticketingsystem.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsExportDTO {

    private AnalyticsSummaryDTO summary;
    private List<TicketsPerDayDTO> ticketsOverTime;
    private Map<String, Long> statusCounts;
    private Map<String, Long> typeCounts;
    private Map<String, Long> riskCounts;

    public AnalyticsExportDTO(AnalyticsSummaryDTO summary, List<TicketsPerDayDTO> ticketsOverTime, Map<String, Long> statusCounts, Map<String, Long> typeCounts, Map<String, Long> riskCounts) {
        this.summary = summary;
        this.ticketsOverTime = ticketsOverTime;
        this.statusCounts = statusCounts;
        this.typeCounts = typeCounts;
        this.riskCounts = riskCounts;
    }

    public AnalyticsSummaryDTO getSummary() {
        return summary;
    }

    public void setSummary(AnalyticsSummaryDTO summary) {
        this.summary = summary;
    }

    public List<TicketsPerDayDTO> getTicketsOverTime() {
        return ticketsOverTime;
    }

    public void setTicketsOverTime(List<TicketsPerDayDTO> ticketsOverTime) {
        this.ticketsOverTime = ticketsOverTime;
    }

    public Map<String, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<String, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }

    public Map<String, Long> getTypeCounts() {
        return typeCounts;
    }

    public void setTypeCounts(Map<String, Long> typeCounts) {
        this.typeCounts = typeCounts;
    }

    public Map<String, Long> getRiskCounts() {
        return riskCounts;
    }

    public void setRiskCounts(Map<String, Long> riskCounts) {
        this.riskCounts = riskCounts;
    }
}
