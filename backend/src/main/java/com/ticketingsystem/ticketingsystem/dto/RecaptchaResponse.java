package com.ticketingsystem.ticketingsystem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RecaptchaResponse {
    private boolean success;

    @JsonProperty("error-codes")
    private List<String> errorCodes;

    public boolean isSuccess() {
        return success;
    }

    public List<String> getErrorCodes() {
        return errorCodes;
    }
}
