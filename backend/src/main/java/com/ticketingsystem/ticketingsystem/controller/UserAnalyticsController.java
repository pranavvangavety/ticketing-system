package com.ticketingsystem.ticketingsystem.controller;

import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users/analytics")
public class UserAnalyticsController {

    private final AnalyticsService analyticsService;

    public UserAnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary() {
        String username = getCurrentUsername();
        System.out.println("User requested summary: " + username); // DEBUG LOG
        return ResponseEntity.ok(analyticsService.getSummaryStats(username));
    }

    @GetMapping("/tickets-over-time")
    public ResponseEntity<List<TicketsPerDayDTO>> getTicketsOverTime() {
        String username = getCurrentUsername();

        return ResponseEntity.ok(analyticsService.getTicketsPerDay(username));
    }

    @GetMapping("/type-distribution")
    public ResponseEntity<TicketTypeDTO> getTypeDistribution() {
        String username = getCurrentUsername();

        return ResponseEntity.ok(analyticsService.getTicketTypeDistribution(username));
    }

    @GetMapping("/risk-distribution")
    public ResponseEntity<RIskLevelDTO> getRiskDistribution() {
        String username = getCurrentUsername();

        return ResponseEntity.ok(analyticsService.getRiskLevelDistribution(username));
    }

    @GetMapping("/export")
    public ResponseEntity<AnalyticsExportDTO> exportAnalytics() {
        String username = getCurrentUsername();

        return ResponseEntity.ok(analyticsService.getExportData(username));
    }

}
