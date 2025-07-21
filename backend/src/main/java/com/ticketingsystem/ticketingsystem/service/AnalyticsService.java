package com.ticketingsystem.ticketingsystem.service;

import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.model.RiskLevel;
import com.ticketingsystem.ticketingsystem.model.Ticket;
import com.ticketingsystem.ticketingsystem.model.TicketStatus;
import com.ticketingsystem.ticketingsystem.model.TicketType;
import com.ticketingsystem.ticketingsystem.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TicketRepository ticketRepository;

    public AnalyticsService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public AnalyticsSummaryDTO getSummaryStats(String username) {

        long total = (username == null) ? ticketRepository.count() : ticketRepository.countByCreatedBy_Username(username);

        long open = (username == null)
                ? ticketRepository.countByStatus(TicketStatus.OPEN)
                : ticketRepository.countByCreatedBy_UsernameAndStatus(username, TicketStatus.OPEN);

        long closed = (username == null)
                ? ticketRepository.countByStatus(TicketStatus.CLOSED)
                : ticketRepository.countByCreatedBy_UsernameAndStatus(username, TicketStatus.CLOSED);

        long inProgress = (username == null)
                ? ticketRepository.countByStatus(TicketStatus.IN_PROGRESS)
                : ticketRepository.countByCreatedBy_UsernameAndStatus(username, TicketStatus.IN_PROGRESS);

        long inQueue = (username == null)
                ? ticketRepository.countByStatus(TicketStatus.IN_QUEUE)
                : ticketRepository.countByCreatedBy_UsernameAndStatus(username, TicketStatus.IN_QUEUE);

        long onHold = (username == null)
                ? ticketRepository.countByStatus(TicketStatus.ON_HOLD)
                : ticketRepository.countByCreatedBy_UsernameAndStatus(username, TicketStatus.ON_HOLD);



        long pending = open + inProgress + inQueue + onHold;

        return new AnalyticsSummaryDTO(total, open, closed, inProgress, inQueue, onHold, pending);
    }

    public List<TicketsPerDayDTO> getTicketsPerDay(String username) {
        List<Ticket> allTickets = (username == null) ? ticketRepository.findAll() : ticketRepository.findByCreatedBy_Username(username);

        Map<LocalDate, Long> group = allTickets.stream().collect(Collectors.groupingBy(
                t -> t.getCreatedAt().toLocalDate(),
                Collectors.counting()
        ));

        return group.entrySet().stream().sorted(Map.Entry.comparingByKey()) //asc
                .map(e -> new TicketsPerDayDTO(e.getKey(), e.getValue())).toList();
    }


    public TicketTypeDTO getTicketTypeDistribution(String username) {
        long support = (username == null)
                ? ticketRepository.countByType(TicketType.SUPPORT)
                : ticketRepository.countByCreatedBy_UsernameAndType(username, TicketType.SUPPORT);

        long issue = (username == null)
                ? ticketRepository.countByType(TicketType.ISSUE)
                : ticketRepository.countByCreatedBy_UsernameAndType(username, TicketType.ISSUE);

        long changeRequest = (username == null)
                ? ticketRepository.countByType(TicketType.CHANGE_REQUEST)
                : ticketRepository.countByCreatedBy_UsernameAndType(username, TicketType.CHANGE_REQUEST);


        return new TicketTypeDTO(support, issue, changeRequest);
    }



    public RIskLevelDTO getRiskLevelDistribution(String username) {
        long low = (username == null)
                ? ticketRepository.countByRisk(RiskLevel.LOW)
                : ticketRepository.countByCreatedBy_UsernameAndRisk(username, RiskLevel.LOW);

        long medium = (username == null)
                ? ticketRepository.countByRisk(RiskLevel.MEDIUM)
                : ticketRepository.countByCreatedBy_UsernameAndRisk(username, RiskLevel.MEDIUM);

        long high = (username == null)
                ? ticketRepository.countByRisk(RiskLevel.HIGH)
                : ticketRepository.countByCreatedBy_UsernameAndRisk(username, RiskLevel.HIGH);


        return new RIskLevelDTO(low, medium, high);
    }

    public AnalyticsExportDTO getExportData(String username) {
        AnalyticsSummaryDTO summary = getSummaryStats(username);
        List<TicketsPerDayDTO> ticketsOverTime = getTicketsPerDay(username);

        List<Ticket> allTickets = (username == null) ? ticketRepository.findAll() : ticketRepository.findByCreatedBy_Username(username);

        Map<String, Long> statusCounts = allTickets.stream().collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));

        Map<String, Long> typeCounts = allTickets.stream().collect(Collectors.groupingBy(t -> t.getType().name(), Collectors.counting()));

        Map<String, Long> riskCounts = allTickets.stream().collect(Collectors.groupingBy(t -> t.getRisk() != null ? t.getRisk().name() : "Pending(not closed)", Collectors.counting()));

        return new AnalyticsExportDTO(summary, ticketsOverTime, statusCounts, typeCounts, riskCounts);
    }
}
