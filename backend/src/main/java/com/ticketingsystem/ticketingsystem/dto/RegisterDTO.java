package com.ticketingsystem.ticketingsystem.dto;

import jakarta.validation.constraints                       .Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterDTO {

    @NotBlank(message = "Username is required")
    @Size(max = 50, message = "Username cannot be longer than 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@#$%&*!?]{6,15}",
            message = "Password must be 6-15 characters long and include at least one letter and number."
    )
    private String password;

    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "Name cannot be longer than 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid Email format")
    @Size(max = 100, message = "Email cannot be longer than 100 characters")
    private String email;

    @NotBlank(message = "Employee ID is required")
    @Size(max = 20, message = "Employee ID cannot be longer than 20 characters")
    private String empid;

    public RegisterDTO(){

    }

    public RegisterDTO(String username, String password, String name, String email, String empid) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.empid = empid;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmpid() {
        return empid;
    }

    public void setEmpid(String empid) {
        this.empid = empid;
    }

    public UserDTO toUserDTO(){
        return new UserDTO(
                this.username,
                this.name,
                this.email,
                this.empid
        );
    }

    public AuthDTO toAuthDTO() {
        return new AuthDTO(
                this.username,
                this.password
        );
    }

}
