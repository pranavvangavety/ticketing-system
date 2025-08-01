package com.ticketingsystem.ticketingsystem.service;

import com.ticketingsystem.ticketingsystem.exception.EmailAlreadyExistsException;
import com.ticketingsystem.ticketingsystem.exception.InvalidCredentialsException;
import com.ticketingsystem.ticketingsystem.model.Invites;
import com.ticketingsystem.ticketingsystem.model.User;
import com.ticketingsystem.ticketingsystem.repository.InvitesRepository;
import com.ticketingsystem.ticketingsystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class InviteService {

    private final InvitesRepository invitesRepository;

    private final EmailService emailService;

    private final UserRepository userRepository;

    @Autowired
    public InviteService(InvitesRepository invitesRepository, EmailService emailService, UserRepository userRepository) {
        this.invitesRepository = invitesRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public void sendInvite(String email) {

        if(userRepository.existsByEmail(email.toLowerCase())){
//            System.out.println("Throwing Email already exists exception");
            throw new EmailAlreadyExistsException("User with this email already exists");
        }


        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(60);

        Invites invite = new Invites(token, email.toLowerCase(), false, expiry, LocalDateTime.now());
        invitesRepository.save(invite);

        String inviteLink = "https://localhost:5173/register?token=" + token;

        emailService.sendInviteLink(email, inviteLink);
    }

    public boolean validateToken(String token) {
        Optional<Invites> optional = invitesRepository.findByToken(token);
        if(optional.isEmpty()) {
            return false;
        }

        Invites invite = optional.get();
        return !invite.isUsed() && invite.getExpiry().isAfter(LocalDateTime.now());
    }

    @Transactional
    public boolean consumeToken(String token, String email) {
        Optional<Invites> optional = invitesRepository.findByToken(token);

        if(optional.isEmpty()){
            return false;
        }

        Invites invite = optional.get();

        if(invite.isUsed() || invite.getExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }

        if(!invite.getEmail().equalsIgnoreCase(email)) {
            return false;
        }

        invite.setUsed(true);
        invitesRepository.save(invite);
        return true;

    }

}
