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
import java.util.List;
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
    public void closeTicket(Long id, String username) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);

        if (optionalTicket.isEmpty()) {
            logger.warn("Ticket ID {} not found while closing by '{}'", id, username);
            throw new TicketNotFoundException("Ticket not found");
        }

        Ticket t = optionalTicket.get();

        // Safe null checks
        boolean isCreator = t.getCreatedBy() != null && username.equals(t.getCreatedBy().getUsername());
        boolean isAssignedResolver = t.getAssignedTo() != null && username.equals(t.getAssignedTo());

        // Resolver can only close if they are the creator or assigned resolver
        if (!isCreator && !isAssignedResolver) {
            logger.warn("Unauthorized attempt by '{}' to close ticket ID {}", username, id);
            throw new UnauthorizedActionException("You are not authorized to close this ticket.");
        }

        if (t.getStatus() == TicketStatus.CLOSED) {
            logger.info("Ticket ID {} is already closed. Requested by '{}'", id, username);
            throw new UnauthorizedActionException("Ticket is already closed.");
        }

        LocalDateTime closedOn = LocalDateTime.now();
        LocalDateTime createdAt = t.getCreatedAt();

        long hours = Duration.between(createdAt, closedOn).toHours();

        RiskLevel risk;
        if (hours < 3) {
            risk = RiskLevel.LOW;
        } else if (hours <= 12) {
            risk = RiskLevel.MEDIUM;
        } else {
            risk = RiskLevel.HIGH;
        }

        t.setStatus(TicketStatus.CLOSED);
        t.setClosedOn(closedOn);
        t.setRisk(risk);
        t.setClosedBy(username);

        ticketRepository.save(t);

        logger.info("Ticket ID {} closed by '{}'. Risk Level: {}", id, username, risk);
    }


    // Admin closes any ticket
    public void closeTicketByAdmin(Long id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);

        if(ticketOpt.isEmpty()){
            throw new TicketNotFoundException("Ticket not found");
        }

        Ticket ticket = ticketOpt.get();

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

        ticket.setClosedBy("admin");

        ticketRepository.save(ticket);
        logger.info("Ticket ID {} closed by Admin. Risk Level: {}",
                ticket.getId(),  risk);

    }


    // Admin can edit any ticket
    public void updateTicketByAdmin(Long id, AdminUpdateTicketDTO dto) {
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
                closeTicketByAdmin(id);
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
    public void deleteTicket(Long id, boolean  isAdmin) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);

        if(ticketOpt.isEmpty()){
            throw new TicketNotFoundException("Ticket not found");
        }

        Ticket ticket = ticketOpt.get();

        if(!isAdmin){
            throw new UnauthorizedActionException("Not authorized to delete this ticket");
        }

        ticketRepository.delete(ticket);
        logger.info("Ticket ID {} deleted by ADMIN", ticket.getId());
    }


    // Admin can see user-specific open tickets
    // User & Resolver views open tickets
    @Transactional
    public Page<ViewTicketDTO> viewOpenTickets(String username, List<TicketType> typeList, Pageable pageable) {
        Page<Ticket> page;

        logger.info("Open tickets of {} viewed", username);

        if(typeList != null && !typeList.isEmpty()) {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusAndTypeIn(
                    username,
                    TicketStatus.OPEN,
                    typeList,
                    pageable
            );
        } else{
            page = ticketRepository.findByCreatedBy_UsernameAndStatus(
                    username,
                    TicketStatus.OPEN,
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
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()
        ));
    }


    // Admin can view user-specific assigned tickets
    // User & Resolver can view assigned tickets
    @Transactional
    public Page<ViewTicketDTO> viewAssignedTickets (
            String username,
            List<TicketStatus> statusList,
            List<TicketType> typeList,
            Pageable pageable
    ) {
        Page<Ticket> page;

        logger.info("Fetching assigned tickets created by user '{}' ", username);

        List<TicketStatus> defaultStatuses = List.of(
                TicketStatus.IN_QUEUE,
                TicketStatus.IN_PROGRESS,
                TicketStatus.ON_HOLD
        );

        List<TicketStatus> statuses;
        if(statusList != null && !statusList.isEmpty()) {
            statuses = statusList;
        } else {
            statuses = defaultStatuses;
        }

        if(typeList != null && !typeList.isEmpty()) {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusInAndTypeIn(
                    username,
                    statuses,
                    typeList,
                    pageable
            );
        } else {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusIn(
                    username,
                    statuses,
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
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()
        ));
    }



    // User & Resolver  views closed tickets
    // Admin can see user-specific closed tickets,
    @Transactional
    public Page<ViewTicketDTO> viewClosedTickets(
            String username,
            List<TicketType> type,
            String risk,
            String sortField,
            String sortOrder,
            int page,
            int size
    ) {
        Page<Ticket> pageResult;

        logger.info("Closed tickets of {} viewed", username);

        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (type != null && !type.isEmpty() && risk != null) {
            logger.info("Filters added: {}, {}", type, risk);
            pageResult = ticketRepository.findByCreatedBy_UsernameAndStatusAndTypeInAndRisk(
                    username,
                    TicketStatus.CLOSED,
                    type,
                    RiskLevel.valueOf(risk),
                    pageable
            );
        } else if (type != null && !type.isEmpty()) {
            logger.info("Filter added: {}", type);
            pageResult = ticketRepository.findByCreatedBy_UsernameAndStatusAndTypeIn(
                    username,
                    TicketStatus.CLOSED,
                    type,
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
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getRisk(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo(),
                ticket.getClosedBy()
        ));
    }



    // Admin can see all open tickets
    @Transactional
    public Page<ViewTicketDTO> viewAllOpenTickets(List<TicketType> typeList, Pageable pageable){
        Page<Ticket> page;

        logger.info("Admin viewing open tickets");

        if(typeList != null && !typeList.isEmpty()) {
            page = ticketRepository.findByStatusAndTypeIn(
                    TicketStatus.OPEN,
                    typeList,
                    pageable
            );
        } else {
            page = ticketRepository.findByStatus(
                    TicketStatus.OPEN,
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
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()

        ));
    }


    // Admin can view all assigned tickets
    @Transactional
    public Page<ViewTicketDTO> viewAllAssignedTickets(List<TicketStatus> statusList, List<TicketType> typeList, Pageable pageable) {
        logger.info("Assigned tickets viewed by Admin");

        List<TicketStatus> statuses;
        if(statusList != null && !statusList.isEmpty()) {
            statuses = statusList;
        } else {
            statuses = List.of(
                    TicketStatus.IN_QUEUE,
                    TicketStatus.IN_PROGRESS,
                    TicketStatus.ON_HOLD
            );
        }
        Page<Ticket> page;

        if(typeList != null && !typeList.isEmpty()) {
            page = ticketRepository.findByStatusInAndTypeIn(
                    statuses,
                    typeList,
                    pageable
            );
        } else {
            page = ticketRepository.findByStatusIn(
                    statuses,
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
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()
        ));
    }


    // Admin can see all closed tickets
    @Transactional
    public Page<ViewTicketDTO> getAllClosedTickets(List<TicketType> type, String risk, Pageable pageable) {

        Page<Ticket> page;
        logger.info("Closed tickets viewed by Admin");

        if (type != null && !type.isEmpty() && risk != null) {
            logger.info("Filters added: {}, {}", type, risk);
            page = ticketRepository.findByStatusAndTypeInAndRisk(
                    TicketStatus.CLOSED,
                    type,
                    RiskLevel.valueOf(risk),
                    pageable
            );
        } else if (type != null && !type.isEmpty()) {
            logger.info("Filter added: {}", type);
            page = ticketRepository.findByStatusAndTypeIn(
                    TicketStatus.CLOSED,
                    type,
                    pageable
            );
        } else if (risk != null) {
            logger.info("Filter added: {}", risk);
            page = ticketRepository.findByStatusAndRisk(
                    TicketStatus.CLOSED,
                    RiskLevel.valueOf(risk),
                    pageable
            );
        } else {
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
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getRisk(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo(),
                ticket.getClosedBy()
        ));
    }



    // Admin can see admin created open tickets
    @Transactional
    public Page<ViewTicketDTO> getAdminOpenTickets( List<TicketType> typeList, Pageable pageable) {
        logger.info("Admin created open tickets viewed");

        Page<Ticket> page;

        if (typeList != null && !typeList.isEmpty()) {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusAndTypeIn(
                    "admin",
                    TicketStatus.OPEN,
                    typeList,
                    pageable
            );
        } else {
            page = ticketRepository.findByCreatedBy_UsernameAndStatus(
                    "admin",
                    TicketStatus.OPEN,
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
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()
        ));
    }

    //Admin can see admin created assigned tickets
    @Transactional
    public Page<ViewTicketDTO> getAdminAssignedTickets(List<TicketStatus> statusList, List<TicketType> typeList, Pageable pageable) {
        logger.info("Admin viewing assigned tickets");

        List<TicketStatus> defaultAssignedStatuses = List.of(
                TicketStatus.IN_QUEUE,
                TicketStatus.IN_PROGRESS,
                TicketStatus.ON_HOLD
        );

        List<TicketStatus> statuses;
        if (statusList != null && !statusList.isEmpty()) {
            statuses = statusList;
        } else {
            statuses = defaultAssignedStatuses;
        }

        Page<Ticket> page;

        if (typeList != null && !typeList.isEmpty()) {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusInAndTypeIn(
                    "admin", statuses, typeList, pageable
            );
        } else {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusIn(
                    "admin", statuses, pageable
            );
        }

        return page.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()
        ));
    }



    // Admin can see admin created closed tickets
    @Transactional
    public Page<ViewTicketDTO> getAdminClosedTickets(List<TicketType> typeList, Pageable pageable) {
        logger.info("Admin created closed tickets viewed");

        Page<Ticket> page;

        if (typeList != null && !typeList.isEmpty()) {
            page = ticketRepository.findByCreatedBy_UsernameAndStatusAndTypeIn(
                    "admin",
                    TicketStatus.CLOSED,
                    typeList,
                    pageable
            );
        } else {
            page = ticketRepository.findByCreatedBy_UsernameAndStatus(
                    "admin",
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
                ticket.getClosedOn(),
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getRisk(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo(),
                ticket.getClosedBy()
        ));
    }

    // Fetches a ticket by its ID
    public Optional<Ticket> findById(Long id) {
        return ticketRepository.findById(id);
    }


    // Admin can assign a ticket to resolver
    public void assignTicket(Long ticketId, String resolverUsername) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow( () -> new RuntimeException("Ticket not found"));

        if(ticket.getStatus() == TicketStatus.CLOSED) {
            throw new IllegalStateException("Cannot assign resolver to closed tickets");
        }

        if(resolverUsername == null || resolverUsername.trim().isEmpty()) {
            ticket.setAssignedTo(null);
            ticket.setStatus(TicketStatus.OPEN);
            logger.info("Resolver removed from Ticket ID {}", ticketId);
        } else {
            ticket.setAssignedTo(resolverUsername);
            ticket.setStatus(TicketStatus.IN_QUEUE);
            logger.info("Ticket ID {} assigned to resolver {}", ticketId, resolverUsername );
        }

        ticket.setLastUpdated(LocalDateTime.now());
        ticketRepository.save(ticket);
    }


    // Resolver can view open tickets assigned to Resolver
    public Page<ViewTicketDTO> viewOpenTicketsAssignedToResolver(
            String resolverUsername,
            List<TicketType> type,
            List<RiskLevel> risk,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("lastUpdated").descending());
        Page<Ticket> tickets;

        if ((type == null || type.isEmpty()) && (risk == null || risk.isEmpty())) {
            tickets = ticketRepository.findByAssignedToAndStatus(resolverUsername, TicketStatus.OPEN, pageable);
        } else if (type == null || type.isEmpty()) {
            tickets = ticketRepository.findByAssignedToAndStatusAndRiskIn(resolverUsername, TicketStatus.OPEN, risk, pageable);
        } else if (risk == null || risk.isEmpty()) {
            tickets = ticketRepository.findByAssignedToAndStatusAndTypeIn(resolverUsername, TicketStatus.OPEN, type, pageable);
        } else {
            tickets = ticketRepository.findByAssignedToAndStatusAndTypeInAndRiskIn(resolverUsername, TicketStatus.OPEN, type, risk, pageable);
        }

        return tickets.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()
        ));
    }


    // Resolver can view Tickets assigned to Resolver
    public Page<ViewTicketDTO> viewTicketsAssignedToResolver(
            String resolverUsername,
            List<TicketStatus> status,
            List<TicketType> type,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Ticket> tickets;


        if ((status == null || status.isEmpty()) && (type == null || type.isEmpty())) {
            tickets = ticketRepository.findByAssignedToAndStatusIn(
                    resolverUsername,
                    List.of(TicketStatus.IN_QUEUE, TicketStatus.IN_PROGRESS, TicketStatus.ON_HOLD),
                    pageable
            );
        } else if ((status == null || status.isEmpty())) {
            tickets = ticketRepository.findByAssignedToAndTypeInAndStatusIn(
                    resolverUsername,
                    type,
                    List.of(TicketStatus.IN_QUEUE, TicketStatus.IN_PROGRESS, TicketStatus.ON_HOLD),
                    pageable
            );
        } else if ((type == null || type.isEmpty())) {
            tickets = ticketRepository.findByAssignedToAndStatusIn(resolverUsername, status, pageable);
        } else {
            tickets = ticketRepository.findByAssignedToAndStatusInAndTypeIn(resolverUsername, status, type, pageable);
        }

        return tickets.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo()
        ));
    }


    // Resolver can view Tickets closed by resolver
    public Page<ViewTicketDTO> viewTicketsClosedByResolver(
            String resolverUsername,
            List<TicketType> type,
            List<RiskLevel> risk,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("lastUpdated").descending());
        Page<Ticket> tickets;

        if ((type == null || type.isEmpty()) && (risk == null || risk.isEmpty())) {
            tickets = ticketRepository.findByClosedByAndStatus(resolverUsername, TicketStatus.CLOSED, pageable);
        } else if (type == null || type.isEmpty()) {
            tickets = ticketRepository.findByClosedByAndStatusAndRiskIn(resolverUsername, TicketStatus.CLOSED, risk, pageable);
        } else if (risk == null || risk.isEmpty()) {
            tickets = ticketRepository.findByClosedByAndStatusAndTypeIn(resolverUsername, TicketStatus.CLOSED, type, pageable);
        } else {
            tickets = ticketRepository.findByClosedByAndStatusAndTypeInAndRiskIn(resolverUsername, TicketStatus.CLOSED, type, risk, pageable);
        }

        return tickets.map(ticket -> new ViewTicketDTO(
                ticket.getId(),
                ticket.getCreatedBy().getUsername(),
                ticket.getType(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getClosedOn(),
                ticket.getLastUpdated(),
                ticket.getStatus(),
                ticket.getRisk(),
                ticket.getAttachmentName(),
                ticket.getAssignedTo(),
                ticket.getClosedBy()
        ));
    }



}


