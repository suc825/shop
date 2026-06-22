
package com.service.impl;


import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.dao.TokenDao;
import com.entity.TokenEntity;
import com.entity.TokenEntity;
import com.service.TokenService;
import com.utils.CommonUtil;
import com.utils.PageUtils;
import com.utils.Query;
import com.utils.RedisUtil;
import org.springframework.util.StringUtils;


/**
 * token
 */
@Service("tokenService")
public class TokenServiceImpl extends ServiceImpl<TokenDao, TokenEntity> implements TokenService {

	@Autowired(required = false)
	private RedisUtil redisUtil;

	@Override
	public PageUtils queryPage(Map<String, Object> params) {
		Page<TokenEntity> page = this.selectPage(
                new Query<TokenEntity>(params).getPage(),
                new EntityWrapper<TokenEntity>()
        );
        return new PageUtils(page);
	}

	@Override
	public List<TokenEntity> selectListView(Wrapper<TokenEntity> wrapper) {
		return baseMapper.selectListView(wrapper);
	}

	@Override
	public PageUtils queryPage(Map<String, Object> params,
			Wrapper<TokenEntity> wrapper) {
		 Page<TokenEntity> page =new Query<TokenEntity>(params).getPage();
	        page.setRecords(baseMapper.selectListView(page,wrapper));
	    	PageUtils pageUtil = new PageUtils(page);
	    	return pageUtil;
	}

	@Override
	public String generateToken(Long userid,String username, String tableName, String role) {
		TokenEntity tokenEntity = this.selectOne(new EntityWrapper<TokenEntity>().eq("userid", userid).eq("role", role));
		String token = CommonUtil.getRandomString(32);
		Calendar cal = Calendar.getInstance();
    	cal.setTime(new Date());
    	cal.add(Calendar.HOUR_OF_DAY, 1);
		if(tokenEntity!=null) {
			// 删除旧token的Redis缓存
			try {
				if(redisUtil != null) {
					redisUtil.delete(2, "token:" + tokenEntity.getToken());
				}
			} catch (Exception e) {
				// Redis不可用，忽略
			}
			tokenEntity.setToken(token);
			tokenEntity.setExpiratedtime(cal.getTime());
			this.updateById(tokenEntity);
		} else {
			this.insert(new TokenEntity(userid,username, tableName, role, token, cal.getTime()));
		}
		// 将新token存入Redis
		try {
			if(redisUtil != null) {
				redisUtil.set(2, "token:" + token, tokenEntity != null ? tokenEntity : new TokenEntity(userid, username, tableName, role, token, cal.getTime()), 1, TimeUnit.HOURS);
			}
		} catch (Exception e) {
			// Redis不可用，忽略
		}
		return token;
	}

	@Override
	public TokenEntity getTokenEntity(String token) {
		if(StringUtils.isEmpty(token)) {
			return null;
		}
		// 先从Redis查询
		String redisKey = "token:" + token;
		try {
			if(redisUtil != null) {
				Object cached = redisUtil.get(2, redisKey);
				if(cached != null) {
					TokenEntity tokenEntity = (TokenEntity) cached;
					// 检查是否过期
					if(tokenEntity.getExpiratedtime().getTime() > new Date().getTime()) {
						return tokenEntity;
					} else {
						// 已过期，删除Redis缓存
						redisUtil.delete(2, redisKey);
						return null;
					}
				}
			}
		} catch (Exception e) {
			// Redis不可用，继续查询数据库
		}
		// 从数据库查询
		TokenEntity tokenEntity = this.selectOne(new EntityWrapper<TokenEntity>().eq("token", token));
		if(tokenEntity == null || tokenEntity.getExpiratedtime().getTime()<new Date().getTime()) {
			return null;
		}
		// 存入Redis缓存
		try {
			if(redisUtil != null) {
				long remainingTime = tokenEntity.getExpiratedtime().getTime() - new Date().getTime();
				if(remainingTime > 0) {
					redisUtil.set(2, redisKey, tokenEntity, remainingTime, TimeUnit.MILLISECONDS);
				}
			}
		} catch (Exception e) {
			// Redis不可用，忽略
		}
		return tokenEntity;
	}
}
