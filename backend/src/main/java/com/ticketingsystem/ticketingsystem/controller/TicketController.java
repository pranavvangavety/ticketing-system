package com.ticketingsystem.ticketingsystem.controller;

import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.exception.UnauthorizedActionException;
import com.ticketingsystem.ticketingsystem.model.*;
import com.ticketingsystem.ticketingsystem.repository.UserRepository;
import com.ticketingsystem.ticketingsystem.service.AuthService;
import com.ticketingsystem.ticketingsystem.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Base64;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    // User creates new Ticket
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) //(/tickets) //comment
    public ResponseEntity<ViewTicketDTO> createTicket(
            Principal principal,
            @RequestPart("ticket") @Valid TicketDTO ticketDTO,
            @RequestPart(value = "attachment", required = false)MultipartFile file
            ) {

        String username = principal.getName();

        User user = userRepository.findById(username)
                .orElseThrow(() -> new UnauthorizedActionException("User not found"));

        try {
            Ticket saved = ticketService.createTicket(user, ticketDTO, file);

            ViewTicketDTO dto = new ViewTicketDTO(
                    saved.getId(),
                    saved.getCreatedBy().getUsername(),
                    saved.getType(),
                    saved.getTitle(),
                    saved.getDescription(),
                    saved.getCreatedAt(),
                    saved.getLastUpdated(),
                    saved.getStatus(),
                    saved.getAttachmentName(),
                    saved.getAssignedTo()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }


//    // User closes own ticket
//    @PutMapping("user/{id}/close")
//    public ResponseEntity<String> closeTicket(
//            @PathVariable long id,
//            Principal principal
//    ){
//
//        String username = principal.getName();
//        ticketService.closeTicket(id, username);
//        return ResponseEntity.ok("Ticket closed successfully!");
//    }


//    // User deletes own ticket
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteOwnTicket(
//            @PathVariable Long id,
//            @RequestAttribute("username") String username
//    ) {
//        ticketService.deleteTicket(id, false);
//        return ResponseEntity.ok("Ticket deleted successfully");
//    }

    // User views open tickets
    @GetMapping("/open")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewOpenTickets(
            Pageable pageable,
            Principal principal,
            @RequestParam(required = false) List<TicketType> type) {

        Page<ViewTicketDTO> openTickets = ticketService.viewOpenTickets(principal.getName(), type , pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(openTickets));
    }


    // User views assigned tickets
    @GetMapping("/assigned")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAssignedTickets(
            Pageable pageable,
            Principal principal,
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type
    ) {
        Page<ViewTicketDTO> assignedTickets = ticketService.viewAssignedTickets(
                principal.getName(),
                status,
                type,
                pageable
        );

        return ResponseEntity.ok(new PaginatedResponseDTO<>(assignedTickets));
    }


    // User views closed tickets
    @GetMapping("/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewClosedTickets(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) List<TicketType> type,
            @RequestParam(required = false) String risk
    ) {
        Page<ViewTicketDTO> closedTickets = ticketService.viewClosedTickets(
                principal.getName(),
                type,
                risk,
                sortField,
                sortOrder,
                page,
                size
        );

        return ResponseEntity.ok(new PaginatedResponseDTO<>(closedTickets));
    }


    // To download any attached files
    @GetMapping("/{id}/attachment")
    public ResponseEntity<byte[]> downloadAttachment(
            @PathVariable Long id,
            Principal principal
    ) {
        Optional<Ticket> optionalTicket = ticketService.findById(id);

        if (optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = optionalTicket.get();
        String currentUser = principal.getName();

        boolean isCreator = ticket.getCreatedBy().getUsername().equals(currentUser);
        boolean isAssignedResolver = currentUser.equals(ticket.getAssignedTo());
        boolean isAdmin = authService.isAdmin(currentUser);

        if (!isCreator && !isAssignedResolver && !isAdmin) {
            throw new AccessDeniedException("Not authorized to download this file.");
        }

        if (ticket.getAttachmentData() == null) {
            return ResponseEntity.noContent().build();
        }

        byte[] fileData = Base64.getDecoder().decode(ticket.getAttachmentData());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + ticket.getAttachmentName() + "\"")
                .contentType(MediaType.parseMediaType(ticket.getAttachmentType()))
                .body(fileData);
    }



    // Resolver can view Resolver created Closed Tickets
    @PreAuthorize("hasRole('RESOLVER')")
    @GetMapping("/resolver/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewResolverClosedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<TicketType> type,
            @RequestParam(required = false) List<RiskLevel> risk,
            Principal principal
    ) {
        Page<ViewTicketDTO> closedTickets = ticketService.viewTicketsClosedByResolver(
                principal.getName(), type, risk, page, size
        );

        return ResponseEntity.ok(new PaginatedResponseDTO<>(closedTickets));
    }


    // Resolver can view assigned assigned Tickets
    @PreAuthorize("hasRole('RESOLVER')")
    @GetMapping("/resolver/assigned")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewResolverAssignedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type,
            Principal principal
    ) {
        Page<ViewTicketDTO> assignedTickets = ticketService.viewTicketsAssignedToResolver(
                principal.getName(),
                status,
                type,
                page,
                size
        );

        return ResponseEntity.ok(new PaginatedResponseDTO<>(assignedTickets));
    }


    // Resolver can view assigned open tickets
    @PreAuthorize("hasRole('RESOLVER')")
    @GetMapping("/resolver/open")
    public ResponseEntity<Page<ViewTicketDTO>> viewResolverOpenTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<TicketType> type,
            @RequestParam(required = false) List<RiskLevel> risk,
            Principal principal
    ) {
        String resolverUsername = principal.getName();
        Page<ViewTicketDTO> tickets = ticketService.viewOpenTicketsAssignedToResolver(resolverUsername, type, risk, page, size);
        return ResponseEntity.ok(tickets);
    }


    // Resolver can close tickets assigned to Resolver
    @PreAuthorize("hasRole('RESOLVER')")
    @PutMapping("/resolver/{id}/close")
    public ResponseEntity<String> closeTicketByResolver(
            @PathVariable Long id,
            Principal principal
    ) {
        try {
            String username = principal.getName();
            ticketService.closeTicket(id, username);
            return ResponseEntity.ok("Ticket closed successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}

