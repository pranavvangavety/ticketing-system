package com.ticketingsystem.ticketingsystem.dto;

public class ViewUsersDTO {
    private String username;
    private String name;
    private String email;
    private String empid;

    public ViewUsersDTO(String username, String name, String email, String empid) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.empid = empid;
    }

    public ViewUsersDTO() {};


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

}
