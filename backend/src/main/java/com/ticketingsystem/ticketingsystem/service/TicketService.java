package com.ticketingsystem.ticketingsystem.service;


import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.exception.TicketNotFoundException;
import com.ticketingsystem.ticketingsystem.exception.UnauthorizedActionException;
import com.ticketingsystem.ticketingsystem.model.*;
import com.ticketingsystem.ticketingsystem.repository.TicketRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


@Service
public class TicketService {
    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    @Autowired
    private TicketRepository ticketRepository;


    // User creates new Ticket
    @Transactional

    public Ticket createTicket(User user, TicketDTO ticketDTO, MultipartFile file) throws IOException {
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

            if(file != null && !file.isEmpty()) {
                String mimeType = file.getContentType();

                if(!mimeType.equals("application/pdf") && !mimeType.equals("image/jpeg")) {
                    throw new IllegalArgumentException("Only PDF and JPG files are allowed.");
                }

                String originalName = file.getOriginalFilename();
                String fileName = StringUtils.cleanPath(originalName);

                fileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");

                if (originalName.contains("..") || originalName.contains("/") || originalName.contains("\\")) {
                    throw new IllegalArgumentException("Invalid file name.");
                }

                if (fileName.isBlank()) {
                    fileName = "attachment_" + System.currentTimeMillis() + ".bin";
                }


                String base64Encoded = Base64.getEncoder().encodeToString(file.getBytes());

                ticket.setAttachmentName(fileName);
                ticket.setAttachmentType(mimeType);
                ticket.setAttachmentData(base64Encoded);


            }
            Ticket savedTicket = ticketRepository.save(ticket);

            logger.info("New ticket created by user {}: [id = {}, title = {}, type = {}, fileAttached = {}]",
                    user.getUsername(),
                    savedTicket.getId(),
                    savedTicket.getTitle(),
                    savedTicket.getType(),
                    file != null && !file.isEmpty());

            return savedTicket;

        } catch (Exception e) {
            logger.error("Failed to create ticket for user '{}': '{}'", user.getUsername(), e.getMessage(), e);
            throw e;
        }
    }


    // User closes own ticket
    @Transactional

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
    @Transactional
    public Page<ViewTicketDTO> viewOpenTickets(String username, String type, Pageable pageable) {

        Page<Ticket> page;

        logger.info("Open tickets of {} viewed", username);


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
                ticket.getStatus(),
                ticket.getAttachmentName()
        ));
    }


    // User views closed tickets
    // Admin can see user specific closed tickets,
    @Transactional
    public Page<ViewTicketDTO> viewClosedTickets(String username, String type, String risk, String sortField, String sortOrder, int page, int size) {
        Page<Ticket> pageResult;

        logger.info("Closed tickets of {} viewed", username);

        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (type != null && risk != null) {
            logger.info("Filters added: {}, {}", type, risk);
            pageResult = ticketRepository.findByCreatedBy_UsernameAndStatusAndTypeAndRisk(
                    username,
                    TicketStatus.CLOSED,
                    TicketType.valueOf(type),
                    RiskLevel.valueOf(risk),
                    pageable
            );
        } else if (type != null) {
            logger.info("Filter added: {}", type);
            pageResult = ticketRepository.findByCreatedBy_UsernameAndStatusAndType(
                    username,
                    TicketStatus.CLOSED,
                    TicketType.valueOf(type),
                    pageable
            );
        } else if (risk != null) {
            logger.info("Filter added: {}", risk);
            pageResult = ticketRepository.findByCreatedBy_UsernameAndStatusAndRisk(
                    username,
                    TicketStatus.CLOSED,
                    RiskLevel.valueOf(risk),
                    pageable
            );
        } else {
            pageResult = ticketRepository.findByCreatedBy_UsernameAndStatus(
                    username,
                    TicketStatus.CLOSED,
                    pageable
            );
        }

        return pageResult.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getClosedOn(),
                ticket.getLastupdated(),
                ticket.getStatus(),
                ticket.getRisk(),
                ticket.getAttachmentName()

        ));
    }


    // Admin can see all open tickets
    @Transactional
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
                ticket.getStatus(),
                ticket.getAttachmentName()

        ));



    }

    // Admin can see all closed tickets
    @Transactional

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
                    RiskLevel.valueOf(risk),
                    pageable
            );

        }else{
            page = ticketRepository.findByStatus(TicketStatus.CLOSED, pageable);
        }

        logger.info("Returning {} closed tickets", page.getTotalElements());

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
                ticket.getRisk(),
                ticket.getAttachmentName()

        ));
    };

    // Admin can see admin created open tickets
    @Transactional

    public Page<ViewTicketDTO> getAdminOpenTickets(Pageable pageable) {
        logger.info("Admin created open tickets viewed");

        Page<Ticket> page = ticketRepository.findByCreatedBy_UsernameAndStatusNot("admin", TicketStatus.CLOSED, pageable);

        return page.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getLastupdated(),
                ticket.getStatus(),
                ticket.getAttachmentName()

        ));
    }

    // Admin can see admin created closed tickets
    @Transactional

    public Page<ViewTicketDTO> getAdminClosedTickets(Pageable pageable) {
        logger.info("Admin created closed tickets viewed");

        Page<Ticket> page = ticketRepository.findByCreatedBy_UsernameAndStatus("admin",TicketStatus.CLOSED, pageable);

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
                        ticket.getRisk(),
                        ticket.getAttachmentName()

        ));

    }

    public Optional<Ticket> findById(Long id) {
        return ticketRepository.findById(id);
    }

}


