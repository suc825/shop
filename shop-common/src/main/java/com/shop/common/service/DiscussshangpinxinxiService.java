package com.shop.common.service;

import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.IService;
import com.shop.common.utils.PageUtils;
import com.shop.common.entity.DiscussshangpinxinxiEntity;
import java.util.List;
import java.util.Map;
import com.shop.common.entity.vo.DiscussshangpinxinxiVO;
import org.apache.ibatis.annotations.Param;
import com.shop.common.entity.view.DiscussshangpinxinxiView;


/**
 * 商品信息评论表
 *
 * @author 
 * @email 
 * @date 2021-03-13 12:49:52
 */
public interface DiscussshangpinxinxiService extends IService<DiscussshangpinxinxiEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
   	List<DiscussshangpinxinxiVO> selectListVO(Wrapper<DiscussshangpinxinxiEntity> wrapper);
   	
   	DiscussshangpinxinxiVO selectVO(@Param("ew") Wrapper<DiscussshangpinxinxiEntity> wrapper);
   	
   	List<DiscussshangpinxinxiView> selectListView(Wrapper<DiscussshangpinxinxiEntity> wrapper);
   	
   	DiscussshangpinxinxiView selectView(@Param("ew") Wrapper<DiscussshangpinxinxiEntity> wrapper);
   	
   	PageUtils queryPage(Map<String, Object> params,Wrapper<DiscussshangpinxinxiEntity> wrapper);
   	
}

