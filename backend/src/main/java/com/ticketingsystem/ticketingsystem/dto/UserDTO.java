package com.ticketingsystem.ticketingsystem.dto;
import com.ticketingsystem.ticketingsystem.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTO {

    @NotBlank(message = "Username is required")
    @Size(max = 50, message = "Username cannot be longer than 50 characters")
    private String username;

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



    //Getters and Setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
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

    //No arg constructor
    public UserDTO(){

    }

    //Constructor
    public UserDTO(String username, String name, String email, String empid) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.empid = empid;
    }

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.empid = user.getEmpid();
    }

}
