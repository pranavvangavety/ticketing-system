package com.ticketingsystem.ticketingsystem.controller;

import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.exception.UnauthorizedActionException;
import com.ticketingsystem.ticketingsystem.model.Ticket;
import com.ticketingsystem.ticketingsystem.model.User;
import com.ticketingsystem.ticketingsystem.repository.UserRepository;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Base64;
import java.util.Optional;


@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

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
                    saved.getLastupdated(),
                    saved.getStatus(),
                    saved.getAttachmentName()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IOException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }


    // User closes own ticket
    @PutMapping("/{id}/close")
    public ResponseEntity<String> closeTicket(
            @PathVariable long id,
            Principal principal
    ){

        String username = principal.getName();
        ticketService.closeTicket(id, username);
        return ResponseEntity.ok("Ticket closed successfully!");
    }


    // User deletes own ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOwnTicket(
            @PathVariable Long id,
            @RequestAttribute("username") String username
    ) {
        ticketService.deleteTicket(id, username, false);
        return ResponseEntity.ok("Ticket deleted successfully");
    }

    // User views open tickets
    @GetMapping("/open")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewOpenTickets(
            Pageable pageable,
            Principal principal,
            @RequestParam(required = false) String type) {

        Page<ViewTicketDTO> openTickets = ticketService.viewOpenTickets(principal.getName(), type , pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(openTickets));
    }

    @GetMapping("/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewClosedTickets(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) String type,
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

    @GetMapping("/{id}/attachment")
    public ResponseEntity<byte[]> downloadAttachment(
            @PathVariable Long id
    ) {
        Optional<Ticket> optionalTicket = ticketService.findById(id);


        if(optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = optionalTicket.get();

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean isAdmin = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!ticket.getCreatedBy().getUsername().equals(currentUsername) && !isAdmin) {
            throw new AccessDeniedException("Not authorized to download this file.");
        }


        if(ticket.getAttachmentData() == null) {
            return ResponseEntity.noContent().build();
        }

        byte[] fileData = Base64.getDecoder().decode(ticket.getAttachmentData());

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ticket.getAttachmentName() + "\"")
                .contentType(MediaType.parseMediaType(ticket.getAttachmentType()))
                .body(fileData);
    }

}

