package com.shop.common.service;

import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.IService;
import com.shop.common.utils.PageUtils;
import com.shop.common.entity.ShangpinfenleiEntity;
import java.util.List;
import java.util.Map;
import com.shop.common.entity.vo.ShangpinfenleiVO;
import org.apache.ibatis.annotations.Param;
import com.shop.common.entity.view.ShangpinfenleiView;


/**
 * 商品分类
 *
 * @author 
 * @email 
 * @date 2021-03-13 12:49:51
 */
public interface ShangpinfenleiService extends IService<ShangpinfenleiEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
   	List<ShangpinfenleiVO> selectListVO(Wrapper<ShangpinfenleiEntity> wrapper);
   	
   	ShangpinfenleiVO selectVO(@Param("ew") Wrapper<ShangpinfenleiEntity> wrapper);
   	
   	List<ShangpinfenleiView> selectListView(Wrapper<ShangpinfenleiEntity> wrapper);
   	
   	ShangpinfenleiView selectView(@Param("ew") Wrapper<ShangpinfenleiEntity> wrapper);
   	
   	PageUtils queryPage(Map<String, Object> params,Wrapper<ShangpinfenleiEntity> wrapper);
   	
}

