package com.shop.gateway.filter;

import com.alibaba.fastjson.JSONObject;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.shop.common.entity.TokenEntity;
import com.shop.common.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 网关鉴权过滤器
 */
@Component
public class AuthFilter extends ZuulFilter {

    @Autowired(required = false)
    private TokenService tokenService;

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();

        // 支持跨域
        HttpServletResponse response = ctx.getResponse();
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with,request-source,Token,Origin,imgType,Content-Type,cache-control,postman-token,Cookie,Accept,authorization");
        String origin = request.getHeader("Origin");
        if (origin != null) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }

        // OPTIONS请求直接放行
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            ctx.setSendZuulResponse(false);
            ctx.setResponseStatusCode(200);
            return null;
        }

        String uri = request.getRequestURI();

        // 验证Token（无论是否公开路径都尝试验证，以便传递用户信息）
        String token = request.getHeader("Token");
        if (token == null || token.isEmpty()) {
            token = request.getParameter("token");
        }

        if (token != null && !token.isEmpty() && tokenService != null) {
            TokenEntity tokenEntity = tokenService.getTokenEntity(token);
            if (tokenEntity != null) {
                // 将用户信息放入请求头，传递给下游服务
                ctx.addZuulRequestHeader("userId", String.valueOf(tokenEntity.getUserid()));
                ctx.addZuulRequestHeader("role", tokenEntity.getRole());
                ctx.addZuulRequestHeader("tableName", tokenEntity.getTablename());
                ctx.addZuulRequestHeader("username", tokenEntity.getUsername());
                // 公开路径直接放行
                if (isPublicPath(uri)) {
                    return null;
                }
                return null;
            }
        }

        // 无有效token，公开路径放行
        if (isPublicPath(uri)) {
            return null;
        }

        // 未登录，返回401
        ctx.setSendZuulResponse(false);
        ctx.setResponseStatusCode(401);
        ctx.getResponse().setContentType("application/json;charset=UTF-8");
        String body = JSONObject.toJSONString(com.shop.common.utils.R.error(401, "请先登录"));
        ctx.setResponseBody(body);
        return null;
    }

    /**
     * 判断是否为公开路径（不需要鉴权）
     */
    private boolean isPublicPath(String uri) {
        // 登录、注册、密码重置接口（不需要token）
        if (uri.contains("/users/login") || uri.contains("/users/register") || uri.contains("/users/resetPass") ||
            uri.contains("/yonghu/login") || uri.contains("/yonghu/register") || uri.contains("/yonghu/resetPass")) {
            return true;
        }
        // 列表、详情等公开接口（通过@IgnoreAuth标记的）
        if (uri.contains("/list") || uri.contains("/detail/") || uri.contains("/autoSort")) {
            return true;
        }
        // CommonController的公开接口
        if (uri.contains("/option/") || uri.contains("/follow/") || uri.contains("/sh/") ||
            uri.contains("/remind/") || uri.contains("/cal/") || uri.contains("/group/") ||
            uri.contains("/value/") || uri.contains("/location") || uri.contains("/matchFace")) {
            return true;
        }
        // Token相关
        if (uri.contains("/token/")) {
            return true;
        }
        return false;
    }
}
