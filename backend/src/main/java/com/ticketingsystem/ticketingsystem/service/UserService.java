package com.ticketingsystem.ticketingsystem.service;

import com.ticketingsystem.ticketingsystem.dto.ViewUsersDTO;
import com.ticketingsystem.ticketingsystem.exception.UnauthorizedActionException;
import com.ticketingsystem.ticketingsystem.model.*;
import com.ticketingsystem.ticketingsystem.repository.AuthRepository;
import com.ticketingsystem.ticketingsystem.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.ticketingsystem.ticketingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.ticketingsystem.ticketingsystem.dto.UserDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private TicketService ticketService;


    // Admin can delete any user
    // User deletes own account
    public void deleteUser(String targetUsername, String requestUsername, boolean isAdmin) {
        Optional<User> userOpt = userRepository.findById(targetUsername);
        Optional<User> deletedOpt = userRepository.findById("deleted_user");

        if(userOpt.isEmpty()){
            throw new UnauthorizedActionException("User not found");
        }
        if(deletedOpt.isEmpty()){
            throw new UnauthorizedActionException("deleted_user must exist in DB. Please restart application.");
        }

        if (targetUsername.equals("deleted_user")) {
            throw new UnauthorizedActionException("System user 'deleted_user' cannot be deleted.");
        }


        if(!isAdmin && !targetUsername.equals(requestUsername)) {
            throw new UnauthorizedActionException("Not authorized to delete this user");
        }

        User deleteUser = deletedOpt.get();

        List<Ticket> userTickets = ticketRepository.findByCreatedBy_Username(targetUsername);
        for (Ticket ticket : userTickets){
            if(ticket.getStatus() != TicketStatus.CLOSED){
                ticketService.closeTicketByAdmin(ticket.getId());
            }
            ticket.setCreatedBy(deleteUser);
        }

        ticketRepository.saveAll(userTickets);

        userRepository.deleteById(targetUsername);
        authRepository.deleteById(targetUsername);

        logger.info("{} deleted", targetUsername);
    }


    // Admin can see a list of all users
    public Page<ViewUsersDTO> viewAllUsers(Pageable pageable) {

        List<String> exclude = List.of("admin", "deleted_user");

        logger.info("viewAllUsers accessed");

        return userRepository.findByUsernameNotIn(exclude, pageable)
                .map(
                        user -> {
                            Optional<Auth> authOptional = authRepository.findById(user.getUsername());
                            Role role = null;

                            if(authOptional.isPresent()) {
                                role = authOptional.get().getRole();
                            }

                            return new ViewUsersDTO(
                                    user.getUsername(),
                                    user.getName(),
                                    user.getEmail(),
                                    user.getEmpid(),
                                    role
                            );
                        }
                );
    }


    // To fetch profiles
    public UserDTO getProfile(String username) {
        User user = userRepository.findById(username).orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(user);
    }


    // Admin can change user's role
    public void changeRole(String username, Role newRole) {
        Optional<Auth> authOpt = authRepository.findById(username);

        if(authOpt.isEmpty()) {
            throw new UnauthorizedActionException("User not found");
        }

        Auth auth = authOpt.get();
        auth.setRole(newRole);
        authRepository.save(auth);

        logger.info("Role for {} set to {}", username, newRole);
    }


    // Fetches a list of all resolvers
    public List<String> getAllResolvers() {
        List<Auth> allUsers = authRepository.findAll();
        List<String> resolvers = new ArrayList<>();

        for (Auth user : allUsers) {
            if (user.getRole() == Role.RESOLVER) {
                resolvers.add(user.getUsername());
            }
        }

        return resolvers;
    }

}
