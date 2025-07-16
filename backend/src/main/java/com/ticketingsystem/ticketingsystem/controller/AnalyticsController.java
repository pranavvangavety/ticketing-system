package com.ticketingsystem.ticketingsystem.controller;

import com.ticketingsystem.ticketingsystem.dto.AnalyticsSummaryDTO;
import com.ticketingsystem.ticketingsystem.dto.RIskLevelDTO;
import com.ticketingsystem.ticketingsystem.dto.TicketTypeDTO;
import com.ticketingsystem.ticketingsystem.dto.TicketsPerDayDTO;
import com.ticketingsystem.ticketingsystem.model.RiskLevel;
import com.ticketingsystem.ticketingsystem.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }


    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getAnalyticsSummary() {
        System.out.println("== INSIDE ANALYTICS CONTROLLER ==");
        System.out.println("Authenticated user: " +
                SecurityContextHolder.getContext().getAuthentication().getName());
        System.out.println("Roles: " +
                SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        AnalyticsSummaryDTO summary = analyticsService.getSummaryStats();
        return ResponseEntity.ok(summary);
    }


    @GetMapping("/tickets-over-time")
    public ResponseEntity<List<TicketsPerDayDTO>> getTicketsOverTime() {
        List<TicketsPerDayDTO> data = analyticsService.getTicketsPerDay();
        return ResponseEntity.ok(data);
    }


    @GetMapping("/type-distribution")
    public ResponseEntity<TicketTypeDTO> getTicketTypeDistribution() {
        return ResponseEntity.ok(analyticsService.getTicketTypeDistribution());
    }


    @GetMapping("/risk-distribution")
    public ResponseEntity<RIskLevelDTO> getRiskLevelDistribution() {
        return ResponseEntity.ok(analyticsService.getRiskLevelDistribution());
    }
}
