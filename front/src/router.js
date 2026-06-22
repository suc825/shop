// Vue Router 4 路由表 — 组件通过 script 标签加载为全局变量
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/center', component: Center },
  { path: '/product/list', component: ProductList },
  { path: '/product/detail', component: ProductDetail },
  { path: '/cart', component: Cart },
  { path: '/order/list', component: OrderList },
  { path: '/order/confirm', component: OrderConfirm },
  { path: '/address/list', component: AddressList },
  { path: '/address/add', component: AddressAdd },
  { path: '/address/update', component: AddressUpdate },
  { path: '/recharge', component: Recharge },
  { path: '/favorites', component: Favorites },
  { path: '/news/list', component: NewsList },
  { path: '/news/detail', component: NewsDetail },
  { path: '/chat', component: Chat },
  { path: '/yonghu/list', component: YonghuList },
  { path: '/yonghu/detail', component: YonghuDetail },
  { path: '/yonghu/add', component: YonghuAdd },
  { path: '/shangpinfenlei/list', component: ShangpinfenleiList },
  { path: '/shangpinfenlei/detail', component: ShangpinfenleiDetail },
  { path: '/shangpinfenlei/add', component: ShangpinfenleiAdd },
  { path: '/dingdanpingjia/list', component: DingdanpingjiaList },
  { path: '/dingdanpingjia/detail', component: DingdanpingjiaDetail },
  { path: '/dingdanpingjia/add', component: DingdanpingjiaAdd },
  { path: '/discussshangpinxinxi/list', component: DiscussshangpinxinxiList },
  { path: '/discussshangpinxinxi/detail', component: DiscussshangpinxinxiDetail },
  { path: '/discussshangpinxinxi/add', component: DiscussshangpinxinxiAdd },
  { path: '/config/list', component: ConfigList },
  { path: '/config/detail', component: ConfigDetail },
  { path: '/config/add', component: ConfigAdd },
  { path: '/users/list', component: UsersList },
  { path: '/users/detail', component: UsersDetail },
  { path: '/users/add', component: UsersAdd },
  { path: '/shangpinxinxi/add', component: ShangpinxinxiAdd },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// 路由守卫：未登录时跳转登录页
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/', '/product/list', '/product/detail', '/news/list', '/news/detail'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('Token');
  if (authRequired && !token) {
    next('/login');
  } else {
    next();
  }
});
