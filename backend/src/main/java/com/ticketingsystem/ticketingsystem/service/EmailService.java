package com.ticketingsystem.ticketingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }


    public void sendResetLink(String toEmail, String resetLink) {

        String body = "Hello, \n\n Please click the link below to reset your password: \n" + resetLink + "\n Please note that this link is valid for 15 minutes. Ignore if you didn't request this. \n\n Regards,\n Ticketing System";
        String subject = "Reset your Ticketing System Password";

        sendEmail(toEmail, subject, body);

        System.out.println("Reset link sent to " + toEmail);

    }

    public void sendInviteLink(String toEmail, String inviteLink) {

        String body = "Hello, \n\nPlease use this invite link to register on Ticketing System:\n" + inviteLink + "\n\nThis link will expire in  60 minutes. \n\nRegards,\nTicketing System";
        String subject = "Ticketing System invitation Link";

        sendEmail(toEmail, subject, body);

        System.out.println("Invite link sent to " + toEmail);

    }

}
