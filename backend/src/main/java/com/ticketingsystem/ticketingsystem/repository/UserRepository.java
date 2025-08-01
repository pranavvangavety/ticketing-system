package com.ticketingsystem.ticketingsystem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ticketingsystem.ticketingsystem.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Page<User> findByUsernameNotIn(List<String> excludedUsernames, Pageable pageable);


    Optional<User> findByUsernameAndEmail(String username, String email);

    boolean existsByEmail(String email);
}
