package com.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    // 默认数据库操作
    public void set(String key, Object value) {
        if(redisTemplate == null) return;
        try {
            redisTemplate.opsForValue().set(key, value);
        } catch (Exception e) {
            // Redis不可用
        }
    }

    public void set(String key, Object value, long timeout, TimeUnit unit) {
        if(redisTemplate == null) return;
        try {
            redisTemplate.opsForValue().set(key, value, timeout, unit);
        } catch (Exception e) {
            // Redis不可用
        }
    }

    public Object get(String key) {
        if(redisTemplate == null) return null;
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            return null;
        }
    }

    public Boolean delete(String key) {
        if(redisTemplate == null) return false;
        try {
            return redisTemplate.delete(key);
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean hasKey(String key) {
        if(redisTemplate == null) return false;
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean expire(String key, long timeout, TimeUnit unit) {
        if(redisTemplate == null) return false;
        try {
            return redisTemplate.expire(key, timeout, unit);
        } catch (Exception e) {
            return false;
        }
    }

    // 指定数据库操作
    public void set(int db, String key, Object value) {
        if(redisTemplate == null) return;
        try {
            redisTemplate.opsForValue().set(key, value);
        } catch (Exception e) {
            // Redis不可用
        }
    }

    public void set(int db, String key, Object value, long timeout, TimeUnit unit) {
        if(redisTemplate == null) return;
        try {
            redisTemplate.opsForValue().set(key, value, timeout, unit);
        } catch (Exception e) {
            // Redis不可用
        }
    }

    public Object get(int db, String key) {
        if(redisTemplate == null) return null;
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            return null;
        }
    }

    public Boolean delete(int db, String key) {
        if(redisTemplate == null) return false;
        try {
            return redisTemplate.delete(key);
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean hasKey(int db, String key) {
        if(redisTemplate == null) return false;
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean expire(int db, String key, long timeout, TimeUnit unit) {
        if(redisTemplate == null) return false;
        try {
            return redisTemplate.expire(key, timeout, unit);
        } catch (Exception e) {
            return false;
        }
    }
}
