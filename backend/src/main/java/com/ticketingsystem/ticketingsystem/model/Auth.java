package com.ticketingsystem.ticketingsystem.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "auth")
public class Auth {

    @Id
    private String username;

    @Column(nullable = false, length = 255 )
    private String password;

    @Column(nullable = false, length = 10)
    private String role;

    //No arg constructor
    public Auth(){
        this.role = "USER";
    }

    //Constructor
    public Auth(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    //Getters and Setters

    public String getUsername(){
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

    public String getRole(){
        return role;
    }
    public void setRole(String role){
        this.role = role;
    }
}
