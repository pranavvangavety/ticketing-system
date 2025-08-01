package com.ticketingsystem.ticketingsystem.controller;

import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.model.TicketStatus;
import com.ticketingsystem.ticketingsystem.model.TicketType;
import com.ticketingsystem.ticketingsystem.service.*;
import jakarta.validation.Valid;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;

import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize(("hasRole('ADMIN')"))
public class AdminController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final AnalyticsService analyticsService;

    @Autowired
    private InviteService inviteService;

    public AdminController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }


    @PutMapping("/tickets/{id}/close") // Admin closes any ticket manually
    public ResponseEntity<String> closeTicketbyAdmin(@PathVariable Long id) {
        ticketService.closeTicketbyAdmin(id);
        return ResponseEntity.ok("Ticket Closed");
    }


    @PutMapping("/tickets/{id}/edit") // Admin can edit any ticket
    public ResponseEntity<String> updateTicketbyAdmin(
            @PathVariable Long id, @RequestBody AdminUpdateTicketDTO dto
            ){
        ticketService.updateTicketbyAdmin(id, dto);
        return ResponseEntity.ok("Ticket Updated successfully");
    }

    @PutMapping("/password") // Admin can change any user's password
    public ResponseEntity<String> changePasswordbyAdmin(
            @RequestBody AdminChangePasswordDTO dto
            ){
        authService.changePasswordbyAdmin(dto.getUsername(), dto.getNewPassword());
        return ResponseEntity.ok("Password Updated successfully");
    }


    @DeleteMapping("/tickets/{id}") // Admin can delete any ticket
    public ResponseEntity<String> deleteTicket(@PathVariable Long id){
        ticketService.deleteTicket(id, null, true);
        return ResponseEntity.ok("Ticket deleted successfully");
    }

    @DeleteMapping("/users/{username}") // Admin can delete any user
    public ResponseEntity<String> deleteUserbyAdmin(@PathVariable String username) {
        userService.deleteUser(username, null, true);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/users") // Admin can see a list of all users
    public ResponseEntity<PaginatedResponseDTO<UserDTO>> viewAllUsers(
            @PageableDefault(size = 10, sort = "username") Pageable pageable){

        Page<UserDTO> usersList = userService.viewAllUsers(pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(usersList));
    }


    @GetMapping("/tickets/{username}/open") // Admin can see user specific open tickets
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewUserOpenTickets(
            @PathVariable String username,
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ViewTicketDTO> tickets = ticketService.viewOpenTickets(username, status, type , pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(tickets));
    }


    @GetMapping("/tickets/{username}/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewUserClosedTickets(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) List<TicketType> type,
            @RequestParam(required = false) String risk
    ) {
        Page<ViewTicketDTO> tickets = ticketService.viewClosedTickets(
                username,
                type,
                risk,
                sortField,
                sortOrder,
                page,
                size
        );
        return ResponseEntity.ok(new PaginatedResponseDTO<>(tickets));
    }



    @GetMapping("/tickets/open") // Admin can see all open tickets
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAllOpenTickets (
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)Pageable pageable)
    {

        Page<ViewTicketDTO> dtoPage = ticketService.viewAllOpenTickets(status, type, pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(dtoPage));
    }


    @GetMapping("/tickets/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAllClosedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) List<TicketType> type,
            @RequestParam(required = false) String risk
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ViewTicketDTO> closedTickets = ticketService.getAllClosedTickets(type, risk, pageable);


        logger.info("Returning {} closed tickets", closedTickets.getTotalElements());

        return ResponseEntity.ok(new PaginatedResponseDTO<>(closedTickets));
    }


    @GetMapping("/tickets/by-admin/open")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAdminOpenTickets(
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<ViewTicketDTO> ticketPage = ticketService.getAdminOpenTickets(status, type, pageable);

        return ResponseEntity.ok(new PaginatedResponseDTO<>(ticketPage));
    }

    @GetMapping("/tickets/by-admin/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAdminClosedTickets(
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ViewTicketDTO> ticketPage = ticketService.getAdminClosedTickets(type, pageable);

        return ResponseEntity.ok(new PaginatedResponseDTO<>(ticketPage));
    }


    @PostMapping("/invite")
    public ResponseEntity<?> sendInvite(
            @RequestBody @Valid InviteRequestDTO request
    ) {
        inviteService.sendInvite(request.getEmail());
        return ResponseEntity.ok("Invite sent to " + request.getEmail());
    }
}
