package com.shop.order.config;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnBean(RabbitTemplate.class)
public class OrderProducer {

    private static final String EXCHANGE = "order.exchange";
    private static final String ROUTING_KEY = "order.delay";

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendDelayMessage(Long orderId, Long delayMillis) {
        rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, orderId, message -> {
            message.getMessageProperties().setExpiration(String.valueOf(delayMillis));
            return message;
        });
    }
}
