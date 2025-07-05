package com.ticketingsystem.ticketingsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminChangePasswordDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "New password is required")
    private String newPassword;

    public AdminChangePasswordDTO(){};

    public AdminChangePasswordDTO(String username, String newPassword) {
        this.username = username;
        this.newPassword = newPassword;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
