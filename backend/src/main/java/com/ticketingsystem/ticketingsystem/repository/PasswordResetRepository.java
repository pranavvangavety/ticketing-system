package com.ticketingsystem.ticketingsystem.repository;

import com.ticketingsystem.ticketingsystem.model.Auth;
import com.ticketingsystem.ticketingsystem.model.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {

    Optional<PasswordReset> findByToken(String token);

    void deleteByAuth(Auth auth);

    Optional<PasswordReset> findByAuth(Auth auth);
}
