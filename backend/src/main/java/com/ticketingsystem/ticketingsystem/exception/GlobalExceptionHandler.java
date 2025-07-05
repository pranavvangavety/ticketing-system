package com.ticketingsystem.ticketingsystem.exception;

import com.ticketingsystem.ticketingsystem.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {

        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream().collect(Collectors.toMap(
                FieldError::getField,
                fieldError -> fieldError.getDefaultMessage(),
                (msg1, msg2) -> msg1
        ));

        logger.warn("Validation failed: {}", errors);


        ErrorResponse response = new ErrorResponse(
                400,
                "Validation failed",
                errors
        );



        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUsernameExists(UsernameAlreadyExistsException ex) {

        logger.warn("UsernameAlreadyExistsException: {}", ex.getMessage());

        ErrorResponse response = new ErrorResponse(
                409,
                "Username already exists",
                null
        );

        return ResponseEntity.status(409).body(response);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {

        logger.warn("Invalid login attempt: {}", ex.getMessage());

        ErrorResponse response = new ErrorResponse(
                401,
                ex.getMessage(),
                null
        );

        return ResponseEntity.status(401).body(response);
    }


    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTicketNotFound(TicketNotFoundException ex){
        ErrorResponse response = new ErrorResponse(
                404,
                ex.getMessage(),
                null
        );

        logger.warn("Ticket not found: {}", ex.getMessage());


        return ResponseEntity.status(404).body(response);
    }


    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedAction(UnauthorizedActionException ex) {

        logger.warn("UnauthorizedActionException: {}", ex.getMessage());

        ErrorResponse response = new ErrorResponse(
                403,
                ex.getMessage(),
                null
        );

        return ResponseEntity.status(403).body(response);
    }
}
