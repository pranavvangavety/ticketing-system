package com.ticketingsystem.ticketingsystem.model;


import jakarta.persistence.*;

@Entity
@Table(name = "auth")
public class Auth {

    @Id
    private String username;

    @Column(nullable = false, length = 255 )
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role;

    @Column(name = "hashed_token", length=255)
    private String hashedToken;

    //No arg constructor
    public Auth(){
        this.role = Role.USER;
    }

    //Constructor
    public Auth(String username, String password, Role role) {
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

    public Role getRole(){
        return role;
    }
    public void setRole(Role role){
        this.role = role;
    }

    public String getHashedToken(){return hashedToken;}
    public void setHashedToken(String hashedToken){this.hashedToken = hashedToken;}
}
