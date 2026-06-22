package com.shop.common.config;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

/**
 * 读写分离切面
 * SELECT操作走从库，INSERT/UPDATE/DELETE走主库
 */
@Aspect
@Component
public class ReadWriteSplitAspect {

    /**
     * 读操作前切换到从库
     */
    @Before("execution(* com.shop.common.service..*.select*(..)) || " +
            "execution(* com.shop.common.service..*.get*(..)) || " +
            "execution(* com.shop.common.service..*.find*(..)) || " +
            "execution(* com.shop.common.service..*.list*(..)) || " +
            "execution(* com.shop.common.service..*.query*(..)) || " +
            "execution(* com.shop.common.service..*.count*(..))")
    public void setReadDataSource(JoinPoint joinPoint) {
        DynamicDataSource.useSlave();
    }

    /**
     * 写操作前切换到主库
     */
    @Before("execution(* com.shop.common.service..*.insert*(..)) || " +
            "execution(* com.shop.common.service..*.save*(..)) || " +
            "execution(* com.shop.common.service..*.add*(..)) || " +
            "execution(* com.shop.common.service..*.update*(..)) || " +
            "execution(* com.shop.common.service..*.delete*(..)) || " +
            "execution(* com.shop.common.service..*.remove*(..))")
    public void setWriteDataSource(JoinPoint joinPoint) {
        DynamicDataSource.useMaster();
    }

    /**
     * 方法执行完毕后清除数据源上下文
     */
    @After("execution(* com.shop.common.service..*.*(..))")
    public void clearDataSource(JoinPoint joinPoint) {
        DynamicDataSource.clear();
    }
}
