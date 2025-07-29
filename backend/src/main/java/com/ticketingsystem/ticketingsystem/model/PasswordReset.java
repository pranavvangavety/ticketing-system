package com.ticketingsystem.ticketingsystem.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class PasswordReset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private LocalDateTime expiresAt;

    @OneToOne
    @JoinColumn(name = "auth_username", referencedColumnName = "username")
    private Auth auth;

    public PasswordReset() {}

    public PasswordReset(Long id, String token, LocalDateTime expiresAt, Auth auth) {
        this.id = id;
        this.token = token;
        this.expiresAt = expiresAt;
        this.auth = auth;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Auth getAuth() {
        return auth;
    }

    public void setAuth(Auth auth) {
        this.auth = auth;
    }
}
