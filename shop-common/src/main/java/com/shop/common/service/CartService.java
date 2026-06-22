package com.shop.common.service;

import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.IService;
import com.shop.common.utils.PageUtils;
import com.shop.common.entity.CartEntity;
import java.util.List;
import java.util.Map;
import com.shop.common.entity.vo.CartVO;
import org.apache.ibatis.annotations.Param;
import com.shop.common.entity.view.CartView;


/**
 * 购物车表
 *
 * @author 
 * @email 
 * @date 2021-03-13 12:49:52
 */
public interface CartService extends IService<CartEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
   	List<CartVO> selectListVO(Wrapper<CartEntity> wrapper);
   	
   	CartVO selectVO(@Param("ew") Wrapper<CartEntity> wrapper);
   	
   	List<CartView> selectListView(Wrapper<CartEntity> wrapper);
   	
   	CartView selectView(@Param("ew") Wrapper<CartEntity> wrapper);
   	
   	PageUtils queryPage(Map<String, Object> params,Wrapper<CartEntity> wrapper);
   	
}

