package com.ticketingsystem.ticketingsystem.controller;


import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.model.Auth;
import com.ticketingsystem.ticketingsystem.model.Invites;
import com.ticketingsystem.ticketingsystem.model.PasswordReset;
import com.ticketingsystem.ticketingsystem.repository.AuthRepository;
import com.ticketingsystem.ticketingsystem.repository.InvitesRepository;
import com.ticketingsystem.ticketingsystem.repository.PasswordResetRepository;
import com.ticketingsystem.ticketingsystem.security.JwtUtil;
import com.ticketingsystem.ticketingsystem.service.AuthService;
import com.ticketingsystem.ticketingsystem.service.InviteService;
import com.ticketingsystem.ticketingsystem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RequestMapping("/auth") //All endpoints in AuthController will now start with "/auth"
@RestController // Indicates to Spring that this class handles HTTP requests
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil; //Injecting JwtUtil

    @Autowired
    private AuthRepository authRepository; //Injecting auth repository

    @Autowired
    private AuthService authService; //Injecting AuthService
    @Autowired
    private InviteService inviteService;
    @Autowired
    private InvitesRepository invitesRepository;

    @Autowired
    private PasswordResetRepository passwordResetRepository;

    //This part of the code separates username and password from rest of the input fields for storing in different databases
    @PostMapping("/register") // register will now have "/register" as endpoint
    public ResponseEntity<String> register(@RequestBody @Valid RegisterDTO dto){

        authService.register(dto); //Using register method in AuthService to register an user

        return ResponseEntity.ok("User Registered Successfully");
    }

    // Code for login logic
    @PostMapping("/login") // login will now have "/login" as endpoint
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid AuthDTO dto){

        LoginResponse response = authService.login(dto);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/changepass")
    public ResponseEntity<String> changePassword(
            @RequestBody @Valid ChangePasswordDTO dto
            ){
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getName();

        authService.changePassword(username, dto);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if(authHeader != null && authHeader.startsWith("Bearer")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            Auth auth = authRepository.findById(username).orElse(null);

            if(auth != null) {
                auth.setHashedToken(null);
                authRepository.save(auth);
            }
        }

        return ResponseEntity.ok().body("Logged out successfully!");
    }


    @GetMapping("/validate") //endpoint for testing connection, token etc
    public ResponseEntity<Void> validate() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordDTO dto
    ) {
        try {
            authService.initiateForgotPassword(dto.getUsername(), dto.getEmail());
            return ResponseEntity.ok("Password reset link sent");
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordDTO dto
    ) {
        try {
            authService.resetPassword(dto.getToken(), dto);
            return ResponseEntity.ok("Password successfully reset");
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

//        System.out.println("RESET PASSWORD ENDPOINT HIT");
//        return ResponseEntity.ok("Received");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(
            @RequestParam String token
    ) {
        Optional<Invites> inviteOpt = invitesRepository.findByToken(token);

        if(inviteOpt.isEmpty()) {
            return ResponseEntity.ok().body(Map.of(
                    "valid", false,
                    "message", "Token not found"
            ));
        }

        Invites invite = inviteOpt.get();

        if(invite.isUsed() || invite.getExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Token is invalid or expired"
            ));
        }

        return ResponseEntity.ok().body(Map.of(
                "valid", true,
                "email", invite.getEmail()
        ));
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        Optional<PasswordReset> optional = passwordResetRepository.findByToken(token);
        if (optional.isEmpty() || optional.get().getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        return ResponseEntity.ok().build();
    }


}
