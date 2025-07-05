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
}
