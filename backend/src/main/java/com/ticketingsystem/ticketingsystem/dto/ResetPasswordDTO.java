package com.ticketingsystem.ticketingsystem.dto;

public class ResetPasswordDTO {

    private String token;
    private String newPassword;
    private String confirmNewPassword;

    public ResetPasswordDTO() {}

    public ResetPasswordDTO(String token, String newPassword, String confirmNewPassword) {
        this.token = token;
        this.newPassword = newPassword;
        this.confirmNewPassword = confirmNewPassword;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmNewPassword() {
        return confirmNewPassword;
    }

    public void setConfirmNewPassword(String confirmNewPassword) {
        this.confirmNewPassword = confirmNewPassword;
    }
}
