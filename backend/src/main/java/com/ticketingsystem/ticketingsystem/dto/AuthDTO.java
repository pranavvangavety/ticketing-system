package com.ticketingsystem.ticketingsystem.dto;

import com.ticketingsystem.ticketingsystem.model.Auth;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    @NotBlank(message = "Username is required")
    @Size(max = 50, message = "Username cannot be longer than 50 characters")
    private String username;


    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@#$%&*!?]{6,15}",
            message = "Password must be 6-15 characters long and include at least one letter and number."
    )
    private String password;

    @NotBlank(message = "reCAPTCHA token is required")
    private String recaptchaToken;

    //No-arg constructor
    public AuthDTO(){

    }
    //Constructors
    public AuthDTO(String username, String password, String recaptchaToken) {
        this.username = username;
        this.password = password;
        this.recaptchaToken = recaptchaToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRecaptchaToken() {
        return recaptchaToken;
    }

    public void setRecaptchaToken(String recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    }

}
