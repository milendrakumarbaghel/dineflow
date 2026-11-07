package com.dineflow.common.security;

import com.dineflow.staff.entity.RestaurantMembership;
import com.dineflow.staff.entity.User;
import com.dineflow.staff.repository.RestaurantMembershipRepository;
import com.dineflow.staff.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RestaurantMembershipRepository membershipRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Optional<RestaurantMembership> membership = membershipRepository.findByUserId(user.getId());

        String role = membership.map(m -> m.getRole().getName()).orElse("STAFF");
        Long restaurantId = membership.map(m -> m.getRestaurant().getId()).orElse(null);

        return UserPrincipal.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPasswordHash())
                .fullName(user.getFullName())
                .role(role)
                .restaurantId(restaurantId)
                .build();
    }
}
