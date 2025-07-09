package com.ticketingsystem.ticketingsystem.service;


import com.ticketingsystem.ticketingsystem.dto.*;
import com.ticketingsystem.ticketingsystem.exception.InvalidCredentialsException;
import com.ticketingsystem.ticketingsystem.exception.UsernameAlreadyExistsException;
import com.ticketingsystem.ticketingsystem.model.PasswordHistory;
import com.ticketingsystem.ticketingsystem.model.User;
import com.ticketingsystem.ticketingsystem.repository.PasswordHistoryRepository;
import com.ticketingsystem.ticketingsystem.security.JwtUtil;
import com.ticketingsystem.ticketingsystem.model.Auth;
import com.ticketingsystem.ticketingsystem.repository.AuthRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.ticketingsystem.ticketingsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthRepository authRepository;

//    @Autowired
//    private Auth auth;

    @Autowired
    private PasswordHistoryRepository passwordHistoryRepository;

    @Transactional // Makes sure the transaction is atomic. Prevents partial registration problem.
    public void register(RegisterDTO dto){
        if(authRepository.existsById(dto.getUsername())){
            throw new UsernameAlreadyExistsException("Username already exists!");
        }

        String hashedpassword = passwordEncoder.encode(dto.getPassword());

        Auth auth = new Auth();
        auth.setUsername(dto.getUsername());
        auth.setPassword(hashedpassword);

        authRepository.save(auth);
        authRepository.flush();


        PasswordHistory firstPassword = new PasswordHistory();
        firstPassword.setUser(auth);
        firstPassword.setPasswordHash(auth.getPassword());

        passwordHistoryRepository.save(firstPassword);

        User user = new User(
                dto.getUsername(),
                dto.getName(),
                dto.getEmail(),
                dto.getEmpid()
        );

        userRepository.save(user);

        logger.info("New user '{}' registration done", dto.getUsername());

    }

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginResponse login(AuthDTO dto) {

        verifyCaptcha(dto.getRecaptchaToken());

        Optional<Auth> storedAuth = authRepository.findById(dto.getUsername());

        if(storedAuth.isEmpty()){
            logger.warn("Auth is empty");
            throw new InvalidCredentialsException("Invalid username or password");
        }

        Auth auth = storedAuth.get();


        if(!passwordEncoder.matches(dto.getPassword(), storedAuth.get().getPassword())) {
            logger.warn("Login failed: Password '{}' not found", dto.getPassword());
            throw new InvalidCredentialsException("Invalid username or password");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(auth.getUsername())
                .password(auth.getPassword())
                .authorities("ROLE_" + auth.getRole().toUpperCase())
                .build();

        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findById(dto.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        logger.info(" {} logged in at {}", auth.getUsername(), LocalDateTime.now());

        System.out.println("===> Sending lastLogin: " + user.getLastLogin());


        return new LoginResponse(true, token, user.getLastLogin());

    }

    // Admin can change any user's password
    public void changePasswordbyAdmin(String username, String newPassword) {

        Optional<Auth> authOpt = authRepository.findById(username);

        if(authOpt.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }

        Auth auth = authOpt.get();
        String encodePassword = passwordEncoder.encode(newPassword);

        auth.setPassword(encodePassword);
        authRepository.save(auth);

        logger.info("{} password changed by admin", username);
    }


    // User can change their password
    public void changePassword(String username, ChangePasswordDTO dto){
        Optional<Auth> authOpt = authRepository.findById(username);

        if(authOpt.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }

        Auth auth = authOpt.get();

        if(!passwordEncoder.matches(dto.getOldPassword(), auth.getPassword())){
            throw new InvalidCredentialsException("Incorrect Password");
        }

        if(!dto.getNewPassword().equals(dto.getConfirmNewPassword())){
            throw new InvalidCredentialsException("Passwords do not match");
        }

        if(dto.getOldPassword().equals(dto.getNewPassword())){
            throw new InvalidCredentialsException("Old Password and new password cannot be the same");
        }

        auth.setPassword(passwordEncoder.encode(dto.getNewPassword()));

        List<PasswordHistory> lastPasswords = passwordHistoryRepository.findByUserOrderByCreatedOnDesc(auth);

        boolean reused = lastPasswords.stream().anyMatch(
                old -> passwordEncoder.matches(dto.getNewPassword(), old.getPasswordHash())
        );

        if(reused){
            throw new InvalidCredentialsException("You cannot reuse your last 5 passwords");
        }

        authRepository.save(auth);

        PasswordHistory historyEntry = new PasswordHistory();
        historyEntry.setUser(auth);
        historyEntry.setPasswordHash(auth.getPassword());

        passwordHistoryRepository.save(historyEntry);

        List<PasswordHistory> allHistory = passwordHistoryRepository.findByUserOrderByCreatedOnDesc(auth);

        if(allHistory.size() > 5){
            List<PasswordHistory> toDelete = allHistory.subList(5, allHistory.size());
            passwordHistoryRepository.deleteAll(toDelete);
        }

        logger.info("Password changed for {}", username);

    }

    private void verifyCaptcha(String token) {
        String secret = "6LcKF30rAAAAABccVRxvgBu33Ms9yUYuhyDFkrl9"; // Your actual secret
        String url = "https://www.google.com/recaptcha/api/siteverify"; // ✅ https instead of http

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", secret);
        params.add("response", token);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // ✅ Add this line

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers); // ✅ Include headers

        ResponseEntity<RecaptchaResponse> response =
                restTemplate.postForEntity(url, request, RecaptchaResponse.class);

        RecaptchaResponse recaptchaResponse = response.getBody();

        if (recaptchaResponse == null || !recaptchaResponse.isSuccess()) {
            logger.warn("reCAPTCHA verification failed: {}", recaptchaResponse != null ? recaptchaResponse.getErrorCodes() : "null response");
            throw new InvalidCredentialsException("reCAPTCHA verification failed");
        }
    }



}
