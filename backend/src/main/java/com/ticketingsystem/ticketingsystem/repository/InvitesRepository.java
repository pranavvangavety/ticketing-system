package com.ticketingsystem.ticketingsystem.repository;

import com.ticketingsystem.ticketingsystem.model.Invites;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvitesRepository extends JpaRepository<Invites, String> {

    Optional<Invites> findByToken(String token);

    boolean existsByEmail(String email);
}
