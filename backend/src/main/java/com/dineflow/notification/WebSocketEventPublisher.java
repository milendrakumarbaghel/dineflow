package com.dineflow.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishOrderUpdate(Long restaurantId, Object orderData) {
        String topic = "/topic/restaurants/" + restaurantId + "/orders";
        log.info("Broadcasting order update to {}", topic);
        messagingTemplate.convertAndSend(topic, orderData);
    }

    public void publishSpecificOrderUpdate(String orderNumber, Object orderData) {
        String topic = "/topic/orders/" + orderNumber;
        log.info("Broadcasting specific order update to {}", topic);
        messagingTemplate.convertAndSend(topic, orderData);
    }

    public void publishQueueUpdate(Long restaurantId, Object queueData) {
        String topic = "/topic/restaurants/" + restaurantId + "/queue";
        log.info("Broadcasting queue update to {}", topic);
        messagingTemplate.convertAndSend(topic, queueData);
    }

    public void publishTableUpdate(Long restaurantId, Object tableData) {
        String topic = "/topic/restaurants/" + restaurantId + "/tables";
        log.info("Broadcasting table update to {}", topic);
        messagingTemplate.convertAndSend(topic, tableData);
    }

    public void publishServiceRequest(Long restaurantId, Object requestData) {
        String topic = "/topic/restaurants/" + restaurantId + "/service-requests";
        log.info("Broadcasting service request to {}", topic);
        messagingTemplate.convertAndSend(topic, requestData);
    }
}
