package com.ticketingsystem.ticketingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public void sendResetLink(String toEmail, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Reset your Ticketing System Password");
        message.setText("Hello, \n\n Please click the link below to reset your password: \n" + resetLink + "\n Please note that this link is valid for 15 minutes. Ignore if you didn't request this. \n\n Regards,\n Ticketing System");
        mailSender.send(message);

        System.out.println("Reset link sent to " + toEmail);

    }

}
