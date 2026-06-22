package com.shop.common.service;

import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.IService;
import com.shop.common.utils.PageUtils;
import com.shop.common.entity.OrdersEntity;
import java.util.List;
import java.util.Map;
import com.shop.common.entity.vo.OrdersVO;
import org.apache.ibatis.annotations.Param;
import com.shop.common.entity.view.OrdersView;


/**
 * 订单
 *
 * @author 
 * @email 
 * @date 2021-03-13 12:49:52
 */
public interface OrdersService extends IService<OrdersEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
   	List<OrdersVO> selectListVO(Wrapper<OrdersEntity> wrapper);
   	
   	OrdersVO selectVO(@Param("ew") Wrapper<OrdersEntity> wrapper);
   	
   	List<OrdersView> selectListView(Wrapper<OrdersEntity> wrapper);
   	
   	OrdersView selectView(@Param("ew") Wrapper<OrdersEntity> wrapper);
   	
   	PageUtils queryPage(Map<String, Object> params,Wrapper<OrdersEntity> wrapper);
   	
}

