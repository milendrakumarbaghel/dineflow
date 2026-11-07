package com.dineflow;

import com.dineflow.common.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil("DineFlowSuperSecureSecretKeyForRestaurantManagement2026AndBeyond!", 3600000);
    }

    @Test
    void testGenerateAndValidateToken() {
        String token = jwtUtil.generateToken(1L, "owner@emberandolive.com", "OWNER", 1L);
        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals("owner@emberandolive.com", jwtUtil.extractEmail(token));
        assertEquals("OWNER", jwtUtil.extractRole(token));
        assertEquals(1L, jwtUtil.extractRestaurantId(token));
        assertEquals(1L, jwtUtil.extractUserId(token));
    }

    @Test
    void testInvalidToken() {
        assertFalse(jwtUtil.validateToken("invalid.token.here"));
    }
}
