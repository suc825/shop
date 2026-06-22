package com.shop.common.config;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.HashMap;
import java.util.Map;

/**
 * 读写分离数据源配置
 */
@Configuration
public class ReadWriteSplitConfig {

    @Value("${datasource.master.jdbc-url}")
    private String masterUrl;

    @Value("${datasource.master.username}")
    private String masterUsername;

    @Value("${datasource.master.password}")
    private String masterPassword;

    @Value("${datasource.master.driver-class-name}")
    private String masterDriver;

    @Value("${datasource.slave.jdbc-url}")
    private String slaveUrl;

    @Value("${datasource.slave.username}")
    private String slaveUsername;

    @Value("${datasource.slave.password}")
    private String slavePassword;

    @Value("${datasource.slave.driver-class-name}")
    private String slaveDriver;

    /**
     * 主库数据源
     */
    @Bean("masterDataSource")
    public DataSource masterDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName(masterDriver);
        dataSource.setJdbcUrl(masterUrl);
        dataSource.setUsername(masterUsername);
        dataSource.setPassword(masterPassword);
        return dataSource;
    }

    /**
     * 从库数据源
     */
    @Bean("slaveDataSource")
    public DataSource slaveDataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName(slaveDriver);
        dataSource.setJdbcUrl(slaveUrl);
        dataSource.setUsername(slaveUsername);
        dataSource.setPassword(slavePassword);
        return dataSource;
    }

    /**
     * 动态数据源（主从切换）
     */
    @Bean
    @Primary
    public DataSource dataSource() {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();

        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put("master", masterDataSource());
        targetDataSources.put("slave", slaveDataSource());

        dynamicDataSource.setTargetDataSources(targetDataSources);
        dynamicDataSource.setDefaultTargetDataSource(masterDataSource());

        return dynamicDataSource;
    }
}
