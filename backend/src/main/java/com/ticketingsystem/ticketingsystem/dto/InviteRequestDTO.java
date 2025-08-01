package com.ticketingsystem.ticketingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class InviteRequestDTO {

    @Email
    @NotBlank
    private String email;


    public InviteRequestDTO() {}

    public InviteRequestDTO(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
