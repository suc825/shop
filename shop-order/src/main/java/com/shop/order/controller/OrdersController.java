package com.shop.order.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

import com.shop.common.utils.ValidatorUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.shop.common.annotation.IgnoreAuth;

import com.shop.common.entity.OrdersEntity;
import com.shop.common.entity.view.OrdersView;

import com.shop.common.service.OrdersService;
import com.shop.common.service.TokenService;
import com.shop.order.config.OrderProducer;
import com.shop.common.utils.PageUtils;
import com.shop.common.utils.R;
import com.shop.common.utils.MD5Util;
import com.shop.common.utils.MPUtil;
import com.shop.common.utils.CommonUtil;


/**
 * 订单
 * 后端接口
 * @author 
 * @email 
 * @date 2021-03-13 12:49:52
 */
@RestController
@RequestMapping("/orders")
public class OrdersController {
    @Autowired
    private OrdersService ordersService;

    @Autowired(required = false)
    private OrderProducer orderProducer;
    


    /**
     * 后端列表
     */
    @RequestMapping("/page")
    public R page(@RequestParam Map<String, Object> params,OrdersEntity orders,
		HttpServletRequest request){
    	if(!java.util.Optional.ofNullable(request.getHeader("role")).orElse("").equals("管理员")) {
    		orders.setUserid(Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0")));
    	}
        EntityWrapper<OrdersEntity> ew = new EntityWrapper<OrdersEntity>();
		PageUtils page = ordersService.queryPage(params, MPUtil.sort(MPUtil.between(MPUtil.likeOrEq(ew, orders), params), params));

        return R.ok().put("data", page);
    }
    
    /**
     * 前端列表
     */
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params,OrdersEntity orders, HttpServletRequest request){
        EntityWrapper<OrdersEntity> ew = new EntityWrapper<OrdersEntity>();
		PageUtils page = ordersService.queryPage(params, MPUtil.sort(MPUtil.between(MPUtil.likeOrEq(ew, orders), params), params));
        return R.ok().put("data", page);
    }

	/**
     * 列表
     */
    @RequestMapping("/lists")
    public R list( OrdersEntity orders){
       	EntityWrapper<OrdersEntity> ew = new EntityWrapper<OrdersEntity>();
      	ew.allEq(MPUtil.allEQMapPre( orders, "orders")); 
        return R.ok().put("data", ordersService.selectListView(ew));
    }

	 /**
     * 查询
     */
    @RequestMapping("/query")
    public R query(OrdersEntity orders){
        EntityWrapper< OrdersEntity> ew = new EntityWrapper< OrdersEntity>();
 		ew.allEq(MPUtil.allEQMapPre( orders, "orders")); 
		OrdersView ordersView =  ordersService.selectView(ew);
		return R.ok("查询订单成功").put("data", ordersView);
    }
	
    /**
     * 后端详情
     */
    @RequestMapping("/info/{id}")
    public R info(@PathVariable("id") Long id){
        OrdersEntity orders = ordersService.selectById(id);
        return R.ok().put("data", orders);
    }

    /**
     * 前端详情
     */
    @RequestMapping("/detail/{id}")
    public R detail(@PathVariable("id") Long id){
        OrdersEntity orders = ordersService.selectById(id);
        return R.ok().put("data", orders);
    }
    



    /**
     * 后端保存
     */
    @RequestMapping("/save")
    public R save(@RequestBody OrdersEntity orders, HttpServletRequest request){
    	orders.setId(new Date().getTime()+new Double(Math.floor(Math.random()*1000)).longValue());
    	//ValidatorUtils.validateEntity(orders);
    	orders.setUserid(Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0")));
    	if(orders.getOrderid() == null || orders.getOrderid().isEmpty()) {
    		orders.setOrderid("ORD" + System.currentTimeMillis() + "_" + (int)(Math.random()*10000));
    	}
        ordersService.insert(orders);
        // 发送延迟消息，30分钟后自动取消未支付订单
        try {
            if(orderProducer != null) {
                orderProducer.sendDelayMessage(orders.getId(), 30 * 60 * 1000L);
            }
        } catch (Exception e) {
            // RabbitMQ不可用，忽略
        }
        return R.ok();
    }

    /**
     * 前端保存
     */
    @RequestMapping("/add")
    public R add(@RequestBody OrdersEntity orders, HttpServletRequest request){
    	orders.setId(new Date().getTime()+new Double(Math.floor(Math.random()*1000)).longValue());
    	if(orders.getOrderid() == null || orders.getOrderid().isEmpty()) {
    		orders.setOrderid("ORD" + System.currentTimeMillis() + "_" + (int)(Math.random()*10000));
    	}
        ordersService.insert(orders);
        System.out.println("=== 订单创建成功，ID: " + orders.getId() + " ===");
        // 发送延迟消息，30分钟后自动取消未支付订单
        try {
            if(orderProducer != null) {
                System.out.println("=== orderProducer 不为 null，开始发送消息 ===");
                orderProducer.sendDelayMessage(orders.getId(), 30 * 60 * 1000L);
                System.out.println("=== 消息发送成功 ===");
            } else {
                System.out.println("=== orderProducer 为 null，跳过发送消息 ===");
            }
        } catch (Exception e) {
            System.out.println("=== 消息发送失败: " + e.getMessage() + " ===");
            e.printStackTrace();
        }
        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public R update(@RequestBody OrdersEntity orders, HttpServletRequest request){
        //ValidatorUtils.validateEntity(orders);
        ordersService.updateById(orders);//全部更新
        return R.ok();
    }
    

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public R delete(@RequestBody Long[] ids){
        ordersService.deleteBatchIds(Arrays.asList(ids));
        return R.ok();
    }
    
    /**
     * 提醒接口
     */
	@RequestMapping("/remind/{columnName}/{type}")
	public R remindCount(@PathVariable("columnName") String columnName, HttpServletRequest request, 
						 @PathVariable("type") String type,@RequestParam Map<String, Object> map) {
		map.put("column", columnName);
		map.put("type", type);
		
		if(type.equals("2")) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar c = Calendar.getInstance();
			Date remindStartDate = null;
			Date remindEndDate = null;
			if(map.get("remindstart")!=null) {
				Integer remindStart = Integer.parseInt(map.get("remindstart").toString());
				c.setTime(new Date()); 
				c.add(Calendar.DAY_OF_MONTH,remindStart);
				remindStartDate = c.getTime();
				map.put("remindstart", sdf.format(remindStartDate));
			}
			if(map.get("remindend")!=null) {
				Integer remindEnd = Integer.parseInt(map.get("remindend").toString());
				c.setTime(new Date());
				c.add(Calendar.DAY_OF_MONTH,remindEnd);
				remindEndDate = c.getTime();
				map.put("remindend", sdf.format(remindEndDate));
			}
		}
		
		Wrapper<OrdersEntity> wrapper = new EntityWrapper<OrdersEntity>();
		if(map.get("remindstart")!=null) {
			wrapper.ge(columnName, map.get("remindstart"));
		}
		if(map.get("remindend")!=null) {
			wrapper.le(columnName, map.get("remindend"));
		}
		if(!java.util.Optional.ofNullable(request.getHeader("role")).orElse("").equals("管理员")) {
    		wrapper.eq("userid", Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0")));
    	}


		int count = ordersService.selectCount(wrapper);
		return R.ok().put("count", count);
	}
	


}
