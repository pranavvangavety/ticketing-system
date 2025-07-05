package com.ticketingsystem.ticketingsystem.service;


import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.exception.TicketNotFoundException;
import com.ticketingsystem.ticketingsystem.exception.UnauthorizedActionException;
import com.ticketingsystem.ticketingsystem.model.*;
import com.ticketingsystem.ticketingsystem.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class TicketService {
    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    @Autowired
    private TicketRepository ticketRepository;


    // User creates new Ticket
    public Ticket createTicket(User user, TicketDTO ticketDTO) {
        try{
            String title = ticketDTO.getTitle();
            String description = ticketDTO.getDescription();
            TicketType type = ticketDTO.getType();

            TicketStatus status = TicketStatus.OPEN;
//        LocalDateTime createdAt = LocalDateTime.now(); // using Jpa auditing now

            Ticket ticket = new Ticket(
                    user,
                    title,
                    description,
                    type,
                    status
//                createdAt // using Jpa auditing now
            );
            Ticket savedTicket = ticketRepository.save(ticket);
            logger.info("New ticket created by user {}: [id = {}, title = {}, type = {}]", user.getUsername(), ticket.getId(), ticket.getTitle(), ticketDTO.getType());
            return savedTicket;
        } catch (Exception e) {
            logger.error("Failed to create ticket for user '{}': '{}'", user.getUsername(), e.getMessage(), e);
            throw e;
        }
    }


    // User closes own ticket
    public void closeTicket(Long id, String username){

        Optional<Ticket> ticket = ticketRepository.findById(id);

        if(ticket.isEmpty()){
            throw new TicketNotFoundException("Ticket not found");
        }

        Ticket t = ticket.get();

        if(!t.getCreatedBy().getUsername().equals(username)){
            throw new UnauthorizedActionException("User not authorized to close this ticket");
        }

        if(t.getStatus() == TicketStatus.CLOSED){
            throw new UnauthorizedActionException("Ticket is already closed.");
        }

        LocalDateTime closedOn = LocalDateTime.now();
        LocalDateTime createdAt = t.getCreatedAt();
        long hours = Duration.between(createdAt, closedOn).toHours();

        RiskLevel risk;
        if(hours < 3){
            risk = RiskLevel.LOW;
        } else if( hours <= 12){
            risk = RiskLevel.MEDIUM;
        }else{
            risk = RiskLevel.HIGH;
        }

        t.setStatus(TicketStatus.CLOSED);
        t.setClosedOn(closedOn);
        t.setRisk(risk);
        ticketRepository.save(t);
        logger.info("Ticket ID {} closed by user '{}'. Risk Level: {}",
                t.getId(), username, risk);

    }



    // Admin closes any ticket manually
    public void closeTicketbyAdmin(Long id) {
        Optional<Ticket> ticketopt = ticketRepository.findById(id);

        if(ticketopt.isEmpty()){
            throw new TicketNotFoundException("Ticket not found");
        }

        Ticket ticket = ticketopt.get();

        if(ticket.getStatus() == TicketStatus.CLOSED){
            throw new UnauthorizedActionException("Ticket is already closed");
        }

        LocalDateTime closedOn = LocalDateTime.now();
        LocalDateTime createdAt = ticket.getCreatedAt();

        long hours = Duration.between(createdAt, closedOn).toHours();

        RiskLevel risk;
        if(hours < 3){
            risk = RiskLevel.LOW;
        }else if(hours <= 12){
            risk = RiskLevel.MEDIUM;
        }else{
            risk = RiskLevel.HIGH;
        }

        ticket.setStatus(TicketStatus.CLOSED);
        ticket.setClosedOn(closedOn);
        ticket.setRisk(risk);

        ticketRepository.save(ticket);
        logger.info("Ticket ID {} closed by Admin. Risk Level: {}",
                ticket.getId(),  risk);

    }

    // Admin can edit any ticket
    public void updateTicketbyAdmin(Long id, AdminUpdateTicketDTO dto) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);

        if(ticketOpt.isEmpty()){
            throw new TicketNotFoundException("Ticket not found");
        }

        Ticket ticket = ticketOpt.get();

        if(dto.getTitle() != null){
            ticket.setTitle(dto.getTitle());
        }

        if(dto.getDescription() != null){
            ticket.setDescription(dto.getDescription());
        }

        if(dto.getType() != null){
            ticket.setType(dto.getType());
        }

        if(dto.getStatus() != null){
            if(dto.getStatus() == TicketStatus.CLOSED && ticket.getStatus() != TicketStatus.CLOSED){
                closeTicketbyAdmin(id);
                return;
            } else if (dto.getStatus() == TicketStatus.CLOSED && ticket.getStatus() == TicketStatus.CLOSED) {
                throw new UnauthorizedActionException("Ticket already closed!");
            } else{
                ticket.setStatus(dto.getStatus());
                ticket.setClosedOn(null);
                ticket.setRisk(null);
            }
        }

        ticketRepository.save(ticket);
        logger.info("Ticket ID {} updated by Admin at {}",
                ticket.getId(), LocalDateTime.now());
    }

    // Admin can delete any ticket
    // User can delete own ticket
    public void deleteTicket(Long id, String requesterUsername, boolean  isAdmin) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);

        if(ticketOpt.isEmpty()){
            throw new TicketNotFoundException("Ticket not found");
        }

        Ticket ticket = ticketOpt.get();

        if(!isAdmin){
            String ticketOwner = ticket.getCreatedBy().getUsername();

            if(!ticketOwner.equals(requesterUsername)){
                throw new UnauthorizedActionException("Not authorized to delete this ticket");
            }
        }

        ticketRepository.delete(ticket);
        if (isAdmin) {
            logger.info("Ticket ID {} deleted by ADMIN", ticket.getId());
        } else {
            logger.info("Ticket ID {} deleted by '{}'", ticket.getId(), requesterUsername);
        }

    }


    // Admin can see user specific open tickets
    // User views open tickets
    public Page<ViewTicketDTO> viewOpenTickets(String username, String type, Pageable pageable) {

        Page<Ticket> page;

        logger.info("Open tickets of {} viewed by", username);


        if(type != null) {
            logger.info("Filter added: {}", type);
            page = ticketRepository.findByCreatedBy_UsernameAndStatusNotAndType(
                    username,
                    TicketStatus.CLOSED,
                    TicketType.valueOf(type),
                    pageable
            );

        } else {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusNot(
                    username,
                    TicketStatus.CLOSED,
                    pageable
            );
        }
        return page.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getLastupdated(),
                ticket.getStatus()
        ));
    }


    // User views closed tickets
    // Admin can see user specific closed tickets,
    public Page<ViewTicketDTO> viewClosedTickets(String username, String type, String risk, Pageable pageable) {

        Page<Ticket> page;

        logger.info("Closed tickets of {} viewed", username);


        if( type != null && risk != null){
            logger.info("Filters added: {}, {}", type, risk);

            page = ticketRepository.findByCreatedBy_UsernameAndStatusAndTypeAndRisk(
                    username,
                    TicketStatus.CLOSED,
                    TicketType.valueOf(type),
                    RiskLevel.valueOf(risk),
                    pageable
            );

        } else if (type != null) {
            logger.info("Filter added: {}", type);
            page = ticketRepository.findByCreatedBy_UsernameAndStatusAndType(
                    username,
                    TicketStatus.CLOSED,
                    TicketType.valueOf(type),
                    pageable
            );

        }else if(risk != null) {
            logger.info("Filter added: {}", risk);

            page = ticketRepository.findByCreatedBy_UsernameAndStatusAndRisk(
                    username,
                    TicketStatus.CLOSED,
                    RiskLevel.valueOf(risk),
                    pageable
            );

        } else{

            page = ticketRepository.findByCreatedBy_UsernameAndStatus(
                    username,
                    TicketStatus.CLOSED,
                    pageable
            );
        }

        return page.map(ticket -> {

            return new ViewTicketDTO(
                    ticket.getId(),
                    ticket.getCreatedBy().getUsername(),
                    ticket.getType(),
                    ticket.getTitle(),
                    ticket.getDescription(),
                    ticket.getCreatedAt(),
                    ticket.getClosedOn(),
                    ticket.getLastupdated(),
                    ticket.getStatus(),
                    ticket.getRisk()
            );
        });
    }

    // Admin can see all open tickets
    public Page<ViewTicketDTO> viewAllOpenTickets(String type, Pageable pageable){
        Page<Ticket> page;
        logger.info("Open tickets viewed by Admin");

        if(type != null){
            logger.info("Filter added: {}", type);
            page = ticketRepository.findByStatusNotAndType(
                    TicketStatus.OPEN,
                    TicketType.valueOf(type),
                    pageable
            );

        } else{
            page =  ticketRepository.findByStatusNot(TicketStatus.CLOSED, pageable);

        }

        return page.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getLastupdated(),
                ticket.getStatus()
        ));



    }

    // Admin can see all closed tickets
    public Page<ViewTicketDTO> getAllClosedTickets(String type, String risk, Pageable pageable){

        Page<Ticket> page;
        logger.info("Closed tickets viewed by Admin");


        if(type != null && risk != null){
            logger.info("Filters added: {}, {}", type, risk);

            page = ticketRepository.findByStatusAndTypeAndRisk(
                    TicketStatus.CLOSED,
                    TicketType.valueOf(type),
                    RiskLevel.valueOf(risk),
                    pageable
            );
        } else if (type != null) {
            logger.info("Filter added: {}", type);
            page = ticketRepository.findByStatusNotAndType(
                    TicketStatus.OPEN,
                    TicketType.valueOf(type),
                    pageable
            );
        } else if (risk != null) {
            logger.info("Filter added: {}", risk);
            page = ticketRepository.findByStatusAndRisk(
                    TicketStatus.CLOSED,
                    RiskLevel.valueOf(type),
                    pageable
            );

        }else{
            page = ticketRepository.findByStatus(TicketStatus.CLOSED, pageable);
        }

        return page.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getClosedOn(),
                ticket.getLastupdated(),
                ticket.getStatus(),
                ticket.getRisk()
        ));
    };


}


