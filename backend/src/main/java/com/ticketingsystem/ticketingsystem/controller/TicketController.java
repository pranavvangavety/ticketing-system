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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    // User creates new Ticket
    @PostMapping //(/tickets) //comment
    public ResponseEntity<ViewTicketDTO> createTicket(
            Principal principal,
            @RequestBody @Valid TicketDTO ticketDTO
            ) {

        String username = principal.getName();

        User user = userRepository.findById(username)
                .orElseThrow(() -> new UnauthorizedActionException("User not found"));


        Ticket saved = ticketService.createTicket(user, ticketDTO);

        ViewTicketDTO dto = new ViewTicketDTO(
                saved.getId(),
                saved.getCreatedBy().getUsername(),
                saved.getType(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getCreatedAt(),
                saved.getLastupdated(),
                saved.getStatus()
        );

        return ResponseEntity.ok(dto);

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

}

