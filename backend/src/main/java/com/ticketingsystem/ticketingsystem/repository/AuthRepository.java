package com.ticketingsystem.ticketingsystem.repository;

import com.ticketingsystem.ticketingsystem.model.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ticketingsystem.ticketingsystem.model.Auth;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<Auth, String> {


    Optional<Auth> findByUsername(String username);
}
