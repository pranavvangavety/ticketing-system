package com.ticketingsystem.ticketingsystem.controller;

import com.ticketingsystem.ticketingsystem.dto.UserDTO;
import com.ticketingsystem.ticketingsystem.service.TicketService;
import com.ticketingsystem.ticketingsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController //Tells Spring that this class handles HTTP requests
@RequestMapping("/users")
public class UserController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;


    // User deletes own account
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteOwnAccount() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getName();
        userService.deleteUser(username, username, false);

        return ResponseEntity.ok("Your account has been deleted successfully");
    }

//    @GetMapping("/test")
//    public void test() {
//        return ResponseEntity.ok("Hello, World!");
//    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(Principal principal) {
        String username = principal.getName();
        UserDTO profile = userService.getProfile(username);
        return ResponseEntity.ok(profile);
    }
}
