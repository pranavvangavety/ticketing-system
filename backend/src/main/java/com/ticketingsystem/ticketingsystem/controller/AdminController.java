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

    // Admin closes any ticket manually
    @PutMapping("/tickets/{id}/close")
    public ResponseEntity<String> closeTicketByAdmin(@PathVariable Long id) {
        ticketService.closeTicketByAdmin(id);
        return ResponseEntity.ok("Ticket Closed");
    }

    // Admin can edit any ticket
    @PutMapping("/tickets/{id}/edit")
    public ResponseEntity<String> updateTicketByAdmin(
            @PathVariable Long id, @RequestBody AdminUpdateTicketDTO dto
            ){
        ticketService.updateTicketByAdmin(id, dto);
        return ResponseEntity.ok("Ticket Updated successfully");
    }

    // Admin can change any user's password
    @PutMapping("/password")
    public ResponseEntity<String> changePasswordByAdmin(
            @RequestBody AdminChangePasswordDTO dto
            ){
        authService.changePasswordbyAdmin(dto.getUsername(), dto.getNewPassword());
        return ResponseEntity.ok("Password Updated successfully");
    }

    // Admin can delete any ticket
    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<String> deleteTicket(@PathVariable Long id){
        ticketService.deleteTicket(id, true);
        return ResponseEntity.ok("Ticket deleted successfully");
    }

    // Admin can delete any user
    @DeleteMapping("/users/{username}")
    public ResponseEntity<String> deleteUserByAdmin(@PathVariable String username) {
        userService.deleteUser(username, null, true);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Admin can see a list of all users
    @GetMapping("/users")
    public ResponseEntity<PaginatedResponseDTO<ViewUsersDTO>> viewAllUsers(
            @PageableDefault(size = 10, sort = "username") Pageable pageable){

        Page<ViewUsersDTO> usersList = userService.viewAllUsers(pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(usersList));
    }

    // Admin can see user-specific open tickets
    @GetMapping("/tickets/{username}/open")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewUserOpenTickets(
            @PathVariable String username,
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ViewTicketDTO> tickets = ticketService.viewOpenTickets(username, type , pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(tickets));
    }

    // Admin can see user-specific Assigned tickets
    @GetMapping("/tickets/{username}/assigned")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewUserAssignedTickets(
            @PathVariable String username,
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ViewTicketDTO> tickets = ticketService.viewAssignedTickets(username, status, type, pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(tickets));
    }

    // Admin can see user specific closed tickets
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


    // Admin can see all open tickets
    @GetMapping("/tickets/open")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAllOpenTickets (
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)Pageable pageable)
    {

        Page<ViewTicketDTO> dtoPage = ticketService.viewAllOpenTickets(type, pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(dtoPage));
    }

    // Admin can see all Assigned tickets
    @GetMapping("/tickets/assigned")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAllAssignedTickets(
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ViewTicketDTO> assignedTickets = ticketService.viewAllAssignedTickets(status, type, pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(assignedTickets));
    }


    //Admin can see all closed tickets
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


//        logger.info("Returning {} closed tickets", closedTickets.getTotalElements());

        return ResponseEntity.ok(new PaginatedResponseDTO<>(closedTickets));
    }

    // Admin created open tickets
    @GetMapping("/tickets/by-admin/open")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAdminOpenTickets(
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<ViewTicketDTO> ticketPage = ticketService.getAdminOpenTickets(type, pageable);

        return ResponseEntity.ok(new PaginatedResponseDTO<>(ticketPage));
    }

    // Admin created Assigned tickets
    @GetMapping("/tickets/by-admin/assigned")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAdminAssignedTickets(
            @RequestParam(required = false) List<TicketStatus> status,
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ViewTicketDTO> ticketPage = ticketService.getAdminAssignedTickets(status, type, pageable);
        return ResponseEntity.ok(new PaginatedResponseDTO<>(ticketPage));
    }

    // Admin created closed tickets
    @GetMapping("/tickets/by-admin/closed")
    public ResponseEntity<PaginatedResponseDTO<ViewTicketDTO>> viewAdminClosedTickets(
            @RequestParam(required = false) List<TicketType> type,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ViewTicketDTO> ticketPage = ticketService.getAdminClosedTickets(type, pageable);

        return ResponseEntity.ok(new PaginatedResponseDTO<>(ticketPage));
    }


    // To invite new users
    @PostMapping("/invite")
    public ResponseEntity<?> sendInvite(
            @RequestBody @Valid InviteRequestDTO request
    ) {
        inviteService.sendInvite(request.getEmail());
        return ResponseEntity.ok("Invite sent to " + request.getEmail());
    }


    // To assign a ticket to a resolver
    @PutMapping("/tickets/assign")
    public ResponseEntity<?> assignTicket(
            @RequestParam Long id,
            @RequestParam String resolverUsername
    ) {
        ticketService.assignTicket(id, resolverUsername);
        return ResponseEntity.ok("Ticket assigned to" + resolverUsername + "successfully");
    }


    // To change any user's role
    @PutMapping("/users/change-role")
    public ResponseEntity<String> changeRole(
            @RequestBody AssignRoleDTO dto
    ) {
        userService.changeRole(dto.getUsername(), dto.getNewRole());
        return ResponseEntity.ok("Role changed successfully for" + dto.getUsername());
    }


    // To fetch a list of resolvers
    @GetMapping("/resolvers")
    public ResponseEntity<List<String>> getAllResolvers() {
        List<String> resolvers = userService.getAllResolvers();
        return ResponseEntity.ok(resolvers);
    }
}
