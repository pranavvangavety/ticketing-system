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
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
    @PostMapping //(/tickets)
    public ResponseEntity<ViewTicketDTO> createTicket(
            Principal principal,
            @RequestBody @Valid TicketDTO ticketDTO
            ) {

        String username = principal.getName();

        User user = userRepository.findById(username)
                .orElseThrow(() -> new UnauthorizedActionException("User not found"));

//        ticketService.createTicket(user, ticketDTO);

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
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)Pageable pageable, Principal principal,
            @RequestParam(required = false) String type) {

        Page<ViewTicketDTO> openTickets = ticketService.viewOpenTickets(principal.getName(), type , pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(openTickets));
    }

    // User views closed tickets
    @GetMapping("/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewClosedTickets(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)Pageable pageable, Principal principal,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String risk) {
        Page<ViewTicketDTO> closedTickets = ticketService.viewClosedTickets(principal.getName(), type, risk, pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(closedTickets));
    }
}

