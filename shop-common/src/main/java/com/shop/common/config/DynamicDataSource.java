package com.shop.common.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * 动态数据源路由
 * 用于实现读写分离
 */
public class DynamicDataSource extends AbstractRoutingDataSource {

    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();

    /**
     * 使用主库
     */
    public static void useMaster() {
        CONTEXT.set("master");
    }

    /**
     * 使用从库
     */
    public static void useSlave() {
        CONTEXT.set("slave");
    }

    /**
     * 清除数据源上下文
     */
    public static void clear() {
        CONTEXT.remove();
    }

    /**
     * 获取当前数据源key
     */
    @Override
    protected Object determineCurrentLookupKey() {
        return CONTEXT.get();
    }
}
