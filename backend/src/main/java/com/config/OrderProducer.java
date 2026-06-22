package com.config;

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

    /**
     * 发送延迟消息，用于订单超时自动取消
     * 使用消息TTL + 死信队列实现延迟效果
     * @param orderId 订单ID
     * @param delayMillis 延迟时间（毫秒）
     */
    public void sendDelayMessage(Long orderId, Long delayMillis) {
        rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, orderId, message -> {
            // 设置消息TTL，到期后进入死信队列
            message.getMessageProperties().setExpiration(String.valueOf(delayMillis));
            return message;
        });
    }
}
