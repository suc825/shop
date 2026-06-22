package com.config;

import com.entity.OrdersEntity;
import com.service.OrdersService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "spring.rabbitmq.host", matchIfMissing = true)
public class OrderConsumer {

    @Autowired
    private OrdersService ordersService;

    @RabbitListener(queues = "order.cancel.queue")
    public void handleOrderCancel(Long orderId) {
        OrdersEntity order = ordersService.selectById(orderId);
        if (order != null && "未支付".equals(order.getStatus())) {
            order.setStatus("已取消");
            ordersService.updateById(order);
        }
    }
}
