package com.shop.content.controller;

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

import com.shop.common.entity.DiscussshangpinxinxiEntity;
import com.shop.common.entity.view.DiscussshangpinxinxiView;

import com.shop.common.service.DiscussshangpinxinxiService;
import com.shop.common.utils.PageUtils;
import com.shop.common.utils.R;
import com.shop.common.utils.MD5Util;
import com.shop.common.utils.MPUtil;
import com.shop.common.utils.CommonUtil;

@RestController
@RequestMapping("/discussshangpinxinxi")
public class DiscussshangpinxinxiController {
    @Autowired
    private DiscussshangpinxinxiService discussshangpinxinxiService;

    @RequestMapping("/page")
    public R page(@RequestParam Map<String, Object> params,DiscussshangpinxinxiEntity discussshangpinxinxi,
		HttpServletRequest request){
        EntityWrapper<DiscussshangpinxinxiEntity> ew = new EntityWrapper<DiscussshangpinxinxiEntity>();
		PageUtils page = discussshangpinxinxiService.queryPage(params, MPUtil.sort(MPUtil.between(MPUtil.likeOrEq(ew, discussshangpinxinxi), params), params));
        return R.ok().put("data", page);
    }

	@IgnoreAuth
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params,DiscussshangpinxinxiEntity discussshangpinxinxi, HttpServletRequest request){
        EntityWrapper<DiscussshangpinxinxiEntity> ew = new EntityWrapper<DiscussshangpinxinxiEntity>();
		PageUtils page = discussshangpinxinxiService.queryPage(params, MPUtil.sort(MPUtil.between(MPUtil.likeOrEq(ew, discussshangpinxinxi), params), params));
        return R.ok().put("data", page);
    }

    @RequestMapping("/lists")
    public R list( DiscussshangpinxinxiEntity discussshangpinxinxi){
       	EntityWrapper<DiscussshangpinxinxiEntity> ew = new EntityWrapper<DiscussshangpinxinxiEntity>();
      	ew.allEq(MPUtil.allEQMapPre( discussshangpinxinxi, "discussshangpinxinxi"));
        return R.ok().put("data", discussshangpinxinxiService.selectListView(ew));
    }

    @RequestMapping("/query")
    public R query(DiscussshangpinxinxiEntity discussshangpinxinxi){
        EntityWrapper< DiscussshangpinxinxiEntity> ew = new EntityWrapper< DiscussshangpinxinxiEntity>();
 		ew.allEq(MPUtil.allEQMapPre( discussshangpinxinxi, "discussshangpinxinxi"));
		DiscussshangpinxinxiView discussshangpinxinxiView =  discussshangpinxinxiService.selectView(ew);
		return R.ok("查询商品信息评论表成功").put("data", discussshangpinxinxiView);
    }

    @RequestMapping("/info/{id}")
    public R info(@PathVariable("id") Long id){
        DiscussshangpinxinxiEntity discussshangpinxinxi = discussshangpinxinxiService.selectById(id);
        return R.ok().put("data", discussshangpinxinxi);
    }

    @RequestMapping("/detail/{id}")
    public R detail(@PathVariable("id") Long id){
        DiscussshangpinxinxiEntity discussshangpinxinxi = discussshangpinxinxiService.selectById(id);
        return R.ok().put("data", discussshangpinxinxi);
    }

    @RequestMapping("/save")
    public R save(@RequestBody DiscussshangpinxinxiEntity discussshangpinxinxi, HttpServletRequest request){
    	discussshangpinxinxi.setId(new Date().getTime()+new Double(Math.floor(Math.random()*1000)).longValue());
        discussshangpinxinxiService.insert(discussshangpinxinxi);
        return R.ok();
    }

    @RequestMapping("/add")
    public R add(@RequestBody DiscussshangpinxinxiEntity discussshangpinxinxi, HttpServletRequest request){
    	discussshangpinxinxi.setId(new Date().getTime()+new Double(Math.floor(Math.random()*1000)).longValue());
        discussshangpinxinxiService.insert(discussshangpinxinxi);
        return R.ok();
    }

    @RequestMapping("/update")
    public R update(@RequestBody DiscussshangpinxinxiEntity discussshangpinxinxi, HttpServletRequest request){
        discussshangpinxinxiService.updateById(discussshangpinxinxi);
        return R.ok();
    }

    @RequestMapping("/delete")
    public R delete(@RequestBody Long[] ids){
        discussshangpinxinxiService.deleteBatchIds(Arrays.asList(ids));
        return R.ok();
    }

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

		Wrapper<DiscussshangpinxinxiEntity> wrapper = new EntityWrapper<DiscussshangpinxinxiEntity>();
		if(map.get("remindstart")!=null) {
			wrapper.ge(columnName, map.get("remindstart"));
		}
		if(map.get("remindend")!=null) {
			wrapper.le(columnName, map.get("remindend"));
		}

		int count = discussshangpinxinxiService.selectCount(wrapper);
		return R.ok().put("count", count);
	}
}
