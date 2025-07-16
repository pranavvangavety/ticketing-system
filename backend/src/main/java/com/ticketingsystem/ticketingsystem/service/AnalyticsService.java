package com.ticketingsystem.ticketingsystem.service;

import com.ticketingsystem.ticketingsystem.dto.AnalyticsSummaryDTO;
import com.ticketingsystem.ticketingsystem.dto.RIskLevelDTO;
import com.ticketingsystem.ticketingsystem.dto.TicketTypeDTO;
import com.ticketingsystem.ticketingsystem.dto.TicketsPerDayDTO;
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

    public AnalyticsSummaryDTO getSummaryStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(TicketStatus.OPEN);
        long closed = ticketRepository.countByStatus(TicketStatus.CLOSED);
        long inProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long inQueue = ticketRepository.countByStatus(TicketStatus.IN_QUEUE);
        long onHold = ticketRepository.countByStatus(TicketStatus.ON_HOLD);

        long pending = open + inProgress + inQueue + onHold;

        return new AnalyticsSummaryDTO(total, open, closed, inProgress, inQueue, onHold, pending);
    }

    public List<TicketsPerDayDTO> getTicketsPerDay() {
        List<Ticket> allTickets = ticketRepository.findAll();

        Map<LocalDate, Long> group = allTickets.stream().collect(Collectors.groupingBy(
                t -> t.getCreatedAt().toLocalDate(),
                Collectors.counting()
        ));

        return group.entrySet().stream().sorted(Map.Entry.comparingByKey()) //asc
                .map(e -> new TicketsPerDayDTO(e.getKey(), e.getValue())).toList();
    }


    public TicketTypeDTO getTicketTypeDistribution() {
        long support = ticketRepository.countByType(TicketType.SUPPORT);
        long issue = ticketRepository.countByType(TicketType.ISSUE);
        long changeRequest = ticketRepository.countByType(TicketType.CHANGE_REQUEST);

        return new TicketTypeDTO(support, issue, changeRequest);
    }



    public RIskLevelDTO getRiskLevelDistribution() {
        long low = ticketRepository.countByRisk(RiskLevel.LOW);
        long medium = ticketRepository.countByRisk(RiskLevel.MEDIUM);
        long high = ticketRepository.countByRisk(RiskLevel.HIGH);

        return new RIskLevelDTO(low, medium, high);
    }
}
