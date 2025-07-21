package com.ticketingsystem.ticketingsystem.controller;


import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.model.Auth;
import com.ticketingsystem.ticketingsystem.repository.AuthRepository;
import com.ticketingsystem.ticketingsystem.security.JwtUtil;
import com.ticketingsystem.ticketingsystem.service.AuthService;
import com.ticketingsystem.ticketingsystem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth") //All endpoints in AuthController will now start with "/auth"
@RestController // Indicates to Spring that this class handles HTTP requests
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil; //Injecting JwtUtil

    @Autowired
    private AuthRepository authRepository; //Injecting auth repository

    @Autowired
    private AuthService authService; //Injecting AuthService

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


}
