package com.ticketingsystem.ticketingsystem.service;

import com.ticketingsystem.ticketingsystem.dto.ViewUsersDTO;
import com.ticketingsystem.ticketingsystem.exception.UnauthorizedActionException;
import com.ticketingsystem.ticketingsystem.model.Ticket;
import com.ticketingsystem.ticketingsystem.model.TicketStatus;
import com.ticketingsystem.ticketingsystem.repository.AuthRepository;
import com.ticketingsystem.ticketingsystem.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.ticketingsystem.ticketingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.ticketingsystem.ticketingsystem.dto.UserDTO;
import com.ticketingsystem.ticketingsystem.model.User;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
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
                ticketService.closeTicketbyAdmin(ticket.getId());
            }
            ticket.setCreatedBy(deleteUser);
        }

        ticketRepository.saveAll(userTickets);

        userRepository.deleteById(targetUsername);
        authRepository.deleteById(targetUsername);

        logger.info("{} deleted", targetUsername);
    }

    // Admin can see a list of all users
    public Page<UserDTO> viewAllUsers(Pageable pageable) {

        List<String> exclude = List.of("admin", "deleted_user");

        logger.info("viewAllUsers accessed");

        return userRepository.findByUsernameNotIn(exclude, pageable).map(UserDTO::new);

    }


    public UserDTO getProfile(String username) {
        User user = userRepository.findById(username).orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(user);
    }

}
