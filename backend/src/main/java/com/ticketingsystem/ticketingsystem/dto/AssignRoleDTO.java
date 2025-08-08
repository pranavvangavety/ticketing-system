package com.ticketingsystem.ticketingsystem.dto;

import com.ticketingsystem.ticketingsystem.model.Role;

public class AssignRoleDTO {
    private String username;
    private Role newRole;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Role getNewRole() {
        return newRole;
    }

    public void setNewRole(Role newRole) {
        this.newRole = newRole;
    }
}
