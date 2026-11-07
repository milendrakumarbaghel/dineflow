package com.dineflow.staff.service;

import com.dineflow.common.exception.ConflictException;
import com.dineflow.common.exception.ResourceNotFoundException;
import com.dineflow.restaurant.entity.Restaurant;
import com.dineflow.restaurant.repository.RestaurantRepository;
import com.dineflow.staff.dto.StaffInviteRequest;
import com.dineflow.staff.dto.StaffMemberDto;
import com.dineflow.staff.entity.RestaurantMembership;
import com.dineflow.staff.entity.Role;
import com.dineflow.staff.entity.StaffInvitation;
import com.dineflow.staff.entity.User;
import com.dineflow.staff.repository.RestaurantMembershipRepository;
import com.dineflow.staff.repository.RoleRepository;
import com.dineflow.staff.repository.StaffInvitationRepository;
import com.dineflow.staff.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final RestaurantMembershipRepository membershipRepository;
    private final StaffInvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StaffMemberDto> getStaffMembers(String slug) {
        List<StaffMemberDto> list = new ArrayList<>();

        List<RestaurantMembership> memberships = membershipRepository.findByRestaurantSlug(slug);
        for (RestaurantMembership m : memberships) {
            list.add(StaffMemberDto.builder()
                    .id(m.getId())
                    .userId(m.getUser().getId())
                    .name(m.getUser().getFullName())
                    .email(m.getUser().getEmail())
                    .position(m.getTitle() != null ? m.getTitle() : m.getRole().getName())
                    .role(m.getRole().getName())
                    .status(m.isActive() ? "Active" : "Inactive")
                    .phone(m.getUser().getPhone())
                    .build());
        }

        // Add pending invitations
        Restaurant rest = restaurantRepository.findBySlug(slug).orElse(null);
        if (rest != null) {
            List<StaffInvitation> invites = invitationRepository.findByRestaurantId(rest.getId());
            for (StaffInvitation inv : invites) {
                if ("PENDING".equalsIgnoreCase(inv.getStatus())) {
                    list.add(StaffMemberDto.builder()
                            .id(inv.getId())
                            .name(inv.getEmail().split("@")[0])
                            .email(inv.getEmail())
                            .position(inv.getRole().getName())
                            .role(inv.getRole().getName())
                            .status("Invited")
                            .build());
                }
            }
        }

        return list;
    }

    @Transactional
    public StaffMemberDto inviteStaff(String slug, StaffInviteRequest request) {
        Restaurant restaurant = restaurantRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Role role = roleRepository.findByName(request.getRole().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        // Create or find user
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            user = User.builder()
                    .email(request.getEmail())
                    .fullName(request.getEmail().split("@")[0])
                    .passwordHash(passwordEncoder.encode("password123"))
                    .active(true)
                    .build();
            user = userRepository.save(user);
        }

        if (membershipRepository.findByUserIdAndRestaurantId(user.getId(), restaurant.getId()).isPresent()) {
            throw new ConflictException("User is already a member of this restaurant");
        }

        RestaurantMembership membership = RestaurantMembership.builder()
                .restaurant(restaurant)
                .user(user)
                .role(role)
                .title(request.getPosition() != null ? request.getPosition() : role.getName())
                .active(true)
                .build();

        RestaurantMembership saved = membershipRepository.save(membership);

        return StaffMemberDto.builder()
                .id(saved.getId())
                .userId(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .position(saved.getTitle())
                .role(role.getName())
                .status("Active")
                .build();
    }

    @Transactional
    public StaffMemberDto updateRole(Long membershipId, String roleName) {
        RestaurantMembership m = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found"));

        Role role = roleRepository.findByName(roleName.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        m.setRole(role);
        RestaurantMembership saved = membershipRepository.save(m);

        return StaffMemberDto.builder()
                .id(saved.getId())
                .userId(saved.getUser().getId())
                .name(saved.getUser().getFullName())
                .email(saved.getUser().getEmail())
                .position(saved.getTitle())
                .role(role.getName())
                .status("Active")
                .build();
    }
}
