
package com.shop.common.service;

import java.util.Map;

import com.baomidou.mybatisplus.service.IService;
import com.shop.common.entity.ConfigEntity;
import com.shop.common.utils.PageUtils;


/**
 * 系统用户
 */
public interface ConfigService extends IService<ConfigEntity> {
	PageUtils queryPage(Map<String, Object> params);
}
