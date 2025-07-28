package com.ticketingsystem.ticketingsystem.repository;

import com.ticketingsystem.ticketingsystem.model.RiskLevel;
import com.ticketingsystem.ticketingsystem.model.TicketStatus;
import com.ticketingsystem.ticketingsystem.model.TicketType;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ticketingsystem.ticketingsystem.model.Ticket;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCreatedBy_Username(
            String username
    );

    Page<Ticket> findByCreatedBy_Username(
            String username,
            Pageable pageable
    );

    Page<Ticket> findByStatusNot(
            TicketStatus status,
            Pageable pageable
    );

    Page<Ticket> findByStatusNotAndType(
            TicketStatus status,
            TicketType type,
            Pageable pageable
    );

    Page<Ticket> findByStatus(
            TicketStatus status,
            Pageable pageable);


    Page<Ticket> findByCreatedBy_UsernameAndStatusNotAndType(
            String username,
            TicketStatus status,
            TicketType type,
            Pageable pageable
    );


    Page<Ticket> findByCreatedBy_UsernameAndStatusNot(
            String username,
            TicketStatus status,
            Pageable pageable
    );

    Page<Ticket> findByCreatedBy_UsernameAndStatus(
            String username,
            TicketStatus status,
            Pageable pageable
    );

    Page<Ticket> findByCreatedBy_UsernameAndStatusAndType(
            String username,
            TicketStatus status,
            TicketType type,
            Pageable pageable
    );

    Page<Ticket> findByCreatedBy_UsernameAndStatusAndRisk(
            String username,
            TicketStatus status,
            RiskLevel risk,
            Pageable pageable
    );

    Page<Ticket> findByCreatedBy_UsernameAndStatusAndTypeAndRisk(
            String username,
            TicketStatus status,
            TicketType type,
            RiskLevel risk,
            Pageable pageable
    );

    Page<Ticket> findByStatusAndTypeAndRisk(
            TicketStatus status,
            TicketType type,
            RiskLevel risk,
            Pageable pageable
    );


    Page<Ticket> findByStatusAndRisk(
            TicketStatus status,
            RiskLevel risk,
            Pageable pageable
    );

    long countByCreatedBy_Username(
            String username
    );

    long countByCreatedBy_UsernameAndStatus(
            String username,
            TicketStatus status
    );

    long countByCreatedBy_UsernameAndType(
            String username,
            TicketType type
    );

    long countByCreatedBy_UsernameAndRisk(
            String username,
            RiskLevel risk
    );

    long countByType(TicketType type);

    long countByRisk(RiskLevel risk);

    long countByStatus(TicketStatus status);


    Page<Ticket> findByStatusAndType(TicketStatus ticketStatus, TicketType ticketType, Pageable pageable);

    Page<Ticket> findByStatusInAndTypeInAndStatusNot(List<TicketStatus> statuses, List<TicketType> types, TicketStatus notStatus, Pageable pageable);

    Page<Ticket> findByStatusInAndStatusNot(List<TicketStatus> statuses, TicketStatus notStatus, Pageable pageable);

    Page<Ticket> findByTypeInAndStatusNot(List<TicketType> types, TicketStatus notStatus, Pageable pageable);

    Page<Ticket> findByCreatedBy_UsernameAndStatusInAndTypeInAndStatusNot(
            String username, List<TicketStatus> statusList, List<TicketType> typeList, TicketStatus excludeStatus, Pageable pageable
    );

    Page<Ticket> findByCreatedBy_UsernameAndStatusInAndStatusNot(
            String username, List<TicketStatus> statusList, TicketStatus excludeStatus, Pageable pageable
    );

    Page<Ticket> findByCreatedBy_UsernameAndTypeInAndStatusNot(
            String username, List<TicketType> typeList, TicketStatus excludeStatus, Pageable pageable
    );

    Page<Ticket> findByCreatedBy_UsernameAndStatusAndTypeIn(
            String username, TicketStatus status, List<TicketType> typeList, Pageable pageable
    );


    Page<Ticket> findByCreatedBy_UsernameAndStatusAndTypeInAndRisk(String username, TicketStatus ticketStatus, List<TicketType> type, RiskLevel riskLevel, Pageable pageable);


    Page<Ticket> findByStatusAndTypeInAndRisk(TicketStatus status, List<TicketType> type, RiskLevel risk, Pageable pageable);
    Page<Ticket> findByStatusAndTypeIn(TicketStatus status, List<TicketType> type, Pageable pageable);

}

