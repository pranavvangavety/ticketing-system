package com.ticketingsystem.ticketingsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ticketingsystem.ticketingsystem.model.Auth;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Auth, String> {


}
