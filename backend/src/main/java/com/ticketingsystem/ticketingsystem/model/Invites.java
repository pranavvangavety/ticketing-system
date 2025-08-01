package com.ticketingsystem.ticketingsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
public class Invites {

    @Id
    private String token;

    private String email;

    private boolean used;

    private LocalDateTime expiry;

    private LocalDateTime createdAt;

    public Invites() {}

    public Invites(String token, String email, boolean used, LocalDateTime expiry, LocalDateTime createdAt) {
        this.token = token;
        this.email = email;
        this.used = used;
        this.expiry = expiry;
        this.createdAt = createdAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public LocalDateTime getExpiry() {
        return expiry;
    }

    public void setExpiry(LocalDateTime expiry) {
        this.expiry = expiry;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
