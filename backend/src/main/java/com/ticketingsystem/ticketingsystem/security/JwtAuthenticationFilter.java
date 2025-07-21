package com.ticketingsystem.ticketingsystem.security;

import com.ticketingsystem.ticketingsystem.exception.SessionExpiredException;
import com.ticketingsystem.ticketingsystem.model.Auth;
import com.ticketingsystem.ticketingsystem.repository.AuthRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtUtil jwtUtil;
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, AuthRepository authRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }



    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException{

        String path = request.getRequestURI();
        System.out.println("Requested URI: " + request.getRequestURI());

        if (path.startsWith("/auth/")) {
            System.out.println("Skipping JWT filter for path: " + path);
            filterChain.doFilter(request, response);
            return;
        }




        System.out.println("Auth set in context: " + SecurityContextHolder.getContext().getAuthentication());

        String authHeader = request.getHeader("Authorization");

        String jwtToken = null;
        String username = null;

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            jwtToken = authHeader.substring(7);
            username = jwtUtil.extractUsername(jwtToken);

            Auth auth = authRepository.findById(username).orElse(null);

            String hashedToken = DigestUtils.sha256Hex(jwtToken);
            if (auth == null || auth.getHashedToken() == null || !hashedToken.equals(auth.getHashedToken())) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\": \"You have been logged out. Please log in again.\"}");
                return;
            }


        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            List<String> roles = jwtUtil.extractAllClaims(jwtToken).get("authorities", List.class);

            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList();

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authToken);

            request.setAttribute("username", username);

            System.out.println("Auth set in context: " + authToken);
        }



        filterChain.doFilter(request, response);
    }
}
