package com.shop.shopping.controller;

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

import com.shop.common.entity.AddressEntity;
import com.shop.common.entity.view.AddressView;

import com.shop.common.service.AddressService;
import com.shop.common.service.TokenService;
import com.shop.common.utils.PageUtils;
import com.shop.common.utils.R;
import com.shop.common.utils.MD5Util;
import com.shop.common.utils.MPUtil;
import com.shop.common.utils.CommonUtil;


/**
 * 地址
 * 后端接口
 * @author 
 * @email 
 * @date 2021-03-13 12:49:52
 */
@RestController
@RequestMapping("/address")
public class AddressController {
    @Autowired
    private AddressService addressService;
    


    /**
     * 后端列表
     */
    @RequestMapping("/page")
    public R page(@RequestParam Map<String, Object> params,AddressEntity address,
		HttpServletRequest request){
    	if(!java.util.Optional.ofNullable(request.getHeader("role")).orElse("").equals("管理员")) {
    		address.setUserid(Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0")));
    	}
        EntityWrapper<AddressEntity> ew = new EntityWrapper<AddressEntity>();
		PageUtils page = addressService.queryPage(params, MPUtil.sort(MPUtil.between(MPUtil.likeOrEq(ew, address), params), params));

        return R.ok().put("data", page);
    }
    
    /**
     * 前端列表
     */
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params,AddressEntity address, HttpServletRequest request){
    	Long headerUserId = Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0"));
    	if(!java.util.Optional.ofNullable(request.getHeader("role")).orElse("").equals("管理员")) {
    		address.setUserid(headerUserId);
    	} else if(address.getUserid() == null && headerUserId > 0) {
    		address.setUserid(headerUserId);
    	}
        EntityWrapper<AddressEntity> ew = new EntityWrapper<AddressEntity>();
		PageUtils page = addressService.queryPage(params, MPUtil.sort(MPUtil.between(MPUtil.likeOrEq(ew, address), params), params));
        return R.ok().put("data", page);
    }

	/**
     * 列表
     */
    @RequestMapping("/lists")
    public R list( AddressEntity address){
       	EntityWrapper<AddressEntity> ew = new EntityWrapper<AddressEntity>();
      	ew.allEq(MPUtil.allEQMapPre( address, "address")); 
        return R.ok().put("data", addressService.selectListView(ew));
    }

	 /**
     * 查询
     */
    @RequestMapping("/query")
    public R query(AddressEntity address){
        EntityWrapper< AddressEntity> ew = new EntityWrapper< AddressEntity>();
 		ew.allEq(MPUtil.allEQMapPre( address, "address")); 
		AddressView addressView =  addressService.selectView(ew);
		return R.ok("查询地址成功").put("data", addressView);
    }
	
    /**
     * 后端详情
     */
    @RequestMapping("/info/{id}")
    public R info(@PathVariable("id") Long id){
        AddressEntity address = addressService.selectById(id);
        return R.ok().put("data", address);
    }

    /**
     * 前端详情
     */
    @RequestMapping("/detail/{id}")
    public R detail(@PathVariable("id") Long id){
        AddressEntity address = addressService.selectById(id);
        return R.ok().put("data", address);
    }
    



    /**
     * 后端保存
     */
    @RequestMapping("/save")
    public R save(@RequestBody AddressEntity address, HttpServletRequest request){
    	address.setId(new Date().getTime()+new Double(Math.floor(Math.random()*1000)).longValue());
    	//ValidatorUtils.validateEntity(address);
    	address.setUserid(Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0")));
		Long userId = Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0"));
    	if(address.getIsdefault().equals("是")) {
    		addressService.updateForSet("isdefault='否'", new EntityWrapper<AddressEntity>().eq("userid", userId));
    	}
    	address.setUserid(userId);
        addressService.insert(address);
        return R.ok();
    }
    
    /**
     * 前端保存
     */
    @RequestMapping("/add")
    public R add(@RequestBody AddressEntity address, HttpServletRequest request){
    	address.setId(new Date().getTime()+new Double(Math.floor(Math.random()*1000)).longValue());
    	//ValidatorUtils.validateEntity(address);
    	address.setUserid(Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0")));
		Long userId = Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0"));
		if(address.getIsdefault() == null) address.setIsdefault("否");
    	if("是".equals(address.getIsdefault())) {
    		addressService.updateForSet("isdefault='否'", new EntityWrapper<AddressEntity>().eq("userid", userId));
    	}
    	address.setUserid(userId);
        addressService.insert(address);
        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public R update(@RequestBody AddressEntity address, HttpServletRequest request){
        //ValidatorUtils.validateEntity(address);
        Long userId = Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0"));
        if(address.getIsdefault() == null) address.setIsdefault("否");
        if("是".equals(address.getIsdefault())) {
    		addressService.updateForSet("isdefault='否'", new EntityWrapper<AddressEntity>().eq("userid", userId));
    	}
        addressService.updateById(address);//全部更新
        return R.ok();
    }

    /**
     * 获取默认地址
     */
    @RequestMapping("/default")
    public R defaultAddress(HttpServletRequest request){
    	Long userId = Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0"));
    	Wrapper<AddressEntity> wrapper = new EntityWrapper<AddressEntity>().eq("isdefault", "是").eq("userid", userId);
        AddressEntity address = addressService.selectOne(wrapper);
        return R.ok().put("data", address);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public R delete(@RequestBody Long[] ids){
        addressService.deleteBatchIds(Arrays.asList(ids));
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
		
		Wrapper<AddressEntity> wrapper = new EntityWrapper<AddressEntity>();
		if(map.get("remindstart")!=null) {
			wrapper.ge(columnName, map.get("remindstart"));
		}
		if(map.get("remindend")!=null) {
			wrapper.le(columnName, map.get("remindend"));
		}
		if(!java.util.Optional.ofNullable(request.getHeader("role")).orElse("").equals("管理员")) {
    		wrapper.eq("userid", Long.parseLong(java.util.Optional.ofNullable(request.getHeader("userId")).orElse("0")));
    	}


		int count = addressService.selectCount(wrapper);
		return R.ok().put("count", count);
	}
	


}
