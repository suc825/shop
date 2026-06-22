package com.shop.common.service;

import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.IService;
import com.shop.common.utils.PageUtils;
import com.shop.common.entity.DingdanpingjiaEntity;
import java.util.List;
import java.util.Map;
import com.shop.common.entity.vo.DingdanpingjiaVO;
import org.apache.ibatis.annotations.Param;
import com.shop.common.entity.view.DingdanpingjiaView;


/**
 * 订单评价
 *
 * @author 
 * @email 
 * @date 2021-03-13 12:49:51
 */
public interface DingdanpingjiaService extends IService<DingdanpingjiaEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
   	List<DingdanpingjiaVO> selectListVO(Wrapper<DingdanpingjiaEntity> wrapper);
   	
   	DingdanpingjiaVO selectVO(@Param("ew") Wrapper<DingdanpingjiaEntity> wrapper);
   	
   	List<DingdanpingjiaView> selectListView(Wrapper<DingdanpingjiaEntity> wrapper);
   	
   	DingdanpingjiaView selectView(@Param("ew") Wrapper<DingdanpingjiaEntity> wrapper);
   	
   	PageUtils queryPage(Map<String, Object> params,Wrapper<DingdanpingjiaEntity> wrapper);
   	
}

