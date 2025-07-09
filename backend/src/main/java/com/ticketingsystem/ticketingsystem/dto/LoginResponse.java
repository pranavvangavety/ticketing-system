package com.ticketingsystem.ticketingsystem.dto;

import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LoginResponse {
    private boolean success;
    private String token;
    private LocalDateTime lastLogin;

    public LoginResponse(boolean success, String token, LocalDateTime lastLogin) {
        this.success = success;
        this.token = token;
        this.lastLogin = lastLogin;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
}
