package com.dineflow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class DineFlowApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring context, Flyway migration scripts V1 & V2, and all entity mappings load successfully
    }
}
