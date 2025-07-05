package com.ticketingsystem.ticketingsystem.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
public class PasswordHistory {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Auth user;

    private String passwordHash;

    private LocalDateTime createdOn;

    @PrePersist
    public void setCreatedOn() {
        this.createdOn = LocalDateTime.now();
    }

    public PasswordHistory(Long id, Auth user, String passwordHash, LocalDateTime createdOn) {
        this.id = id;
        this.user = user;
        this.passwordHash = passwordHash;
        this.createdOn = createdOn;
    }

    public PasswordHistory() {};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Auth getUser() {
        return user;
    }

    public void setUser(Auth user) {
        this.user = user;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }
}
