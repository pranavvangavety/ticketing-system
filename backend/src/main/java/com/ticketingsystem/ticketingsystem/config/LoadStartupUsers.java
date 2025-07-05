package com.ticketingsystem.ticketingsystem.config;

import com.ticketingsystem.ticketingsystem.model.User;
import com.ticketingsystem.ticketingsystem.repository.AuthRepository;
import com.ticketingsystem.ticketingsystem.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.ticketingsystem.ticketingsystem.model.Auth;


@Component
public class LoadStartupUsers {

    private final AuthRepository authrepository;
    private final UserRepository userRepository;

    public LoadStartupUsers(AuthRepository authrepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authrepository = authrepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private final PasswordEncoder passwordEncoder;


    @PostConstruct
    public void loadAdminUser(){

        boolean authExists = authrepository.existsById("admin");
        boolean userExists = userRepository.existsById("admin");

        System.out.println(">>Performing admin checks");

        if(!authExists){
            System.out.println(">>Inserting Admin Credentials into DB");

            Auth admin  = new Auth();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            authrepository.save(admin);
        }else{
            System.out.println(">>Admin credentials exist");
        }

        if(!userExists){
            System.out.println(">>Inserting Admin Profile into DB");

            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setName("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setEmpid("EMP001");
            userRepository.save(adminUser);
        }else{
            System.out.println(">>Admin profile exists");
        }

        System.out.println(">> Admin checks complete");

    }

    @PostConstruct
    public void loadDeletedUser() {
        boolean deletedAuthExists = authrepository.existsById("deleted_user");
        boolean deletedUserExists = userRepository.existsById("deleted_user");

        System.out.println(">>Performing deleted user checks");

        if(!deletedAuthExists) {
            System.out.println(">>Inserting deleted_user credentials into DB");

            Auth deletedAuth = new Auth();
            deletedAuth.setUsername("deleted_user");
            deletedAuth.setPassword(passwordEncoder.encode("deleted"));
            deletedAuth.setRole("USER");

            authrepository.save(deletedAuth);
        }else{
            System.out.println(">>deleted_user credentials exist");
        }

        if(!deletedUserExists){
            System.out.println(">>Inserting deleted_user profile into DB");

            User deletedUser = new User();

            deletedUser.setUsername("deleted_user");
            deletedUser.setName("Deleted User");
            deletedUser.setEmail("deleted@deleted.com");
            deletedUser.setEmpid("DEL01");

            userRepository.save(deletedUser);
        }else{
            System.out.println(">>deleted_user profile exists");
        }

        System.out.println(">>deleted_user checks complete");
    }
}
