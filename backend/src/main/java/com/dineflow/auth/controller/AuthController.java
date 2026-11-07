package com.dineflow.auth.controller;

import com.dineflow.auth.dto.AuthResponse;
import com.dineflow.auth.dto.LoginRequest;
import com.dineflow.common.exception.UnauthorizedException;
import com.dineflow.common.response.ApiResponse;
import com.dineflow.common.security.JwtUtil;
import com.dineflow.common.security.UserPrincipal;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.staff.entity.RestaurantMembership;
import com.dineflow.staff.entity.User;
import com.dineflow.staff.repository.RestaurantMembershipRepository;
import com.dineflow.staff.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RestaurantMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        RestaurantMembership membership = membershipRepository.findByUserId(user.getId())
                .orElseThrow(() -> new UnauthorizedException("User has no active restaurant membership"));

        Restaurant restaurant = membership.getRestaurant();
        String role = membership.getRole().getName();

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), role, restaurant.getId());

        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(role)
                .restaurantId(restaurant.getId())
                .restaurantName(restaurant.getName())
                .restaurantSlug(restaurant.getSlug())
                .build();

        return ResponseEntity.ok(ApiResponse.ok(authResponse, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("Not authenticated");
        }

        RestaurantMembership membership = membershipRepository.findByUserId(principal.getId())
                .orElse(null);

        String restName = membership != null ? membership.getRestaurant().getName() : "";
        String restSlug = membership != null ? membership.getRestaurant().getSlug() : "";

        AuthResponse response = AuthResponse.builder()
                .userId(principal.getId())
                .email(principal.getEmail())
                .fullName(principal.getFullName())
                .role(principal.getRole())
                .restaurantId(principal.getRestaurantId())
                .restaurantName(restName)
                .restaurantSlug(restSlug)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
