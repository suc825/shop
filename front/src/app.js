// Vue 3 应用初始化
const app = Vue.createApp({
  data() {
    return {
      projectName: projectName,
      indexNav: indexNav,
      cartFlag: cartFlag,
      chatFlag: chatFlag,
      userInfo: {},
    };
  },
  mounted() {
    this.loadUser();
  },
  computed: {
    displayName() {
      return this.userInfo.yonghuming || localStorage.getItem('adminName') || '';
    }
  },
  methods: {
    navTo(url) {
      this.$router.push(url);
    },
    centerPage() {
      const userTable = localStorage.getItem('userTable');
      if (userTable) {
        this.$router.push('/center');
      } else {
        this.$router.push('/login');
      }
    },
    loadUser() {
      const table = localStorage.getItem('userTable');
      const token = localStorage.getItem('Token');
      if (table && token) {
        api.get(table + '/session', {}).then(res => {
          this.userInfo = res.data || {};
        });
      }
    },
    logout() {
      localStorage.removeItem('Token');
      localStorage.removeItem('role');
      localStorage.removeItem('userTable');
      localStorage.removeItem('sessionTable');
      localStorage.removeItem('adminName');
      localStorage.removeItem('userid');
      this.userInfo = {};
    },
    isLoggedIn() {
      return !!localStorage.getItem('Token');
    }
  },
  template: `
    <div id="app-root">
      <!-- Header -->
      <header id="header">
        <div class="header-inner">
          <div class="header-left">
            <a class="logo" @click.prevent="navTo('/')">{{ projectName }}</a>
          </div>
          <div class="header-nav">
            <a @click.prevent="navTo('/')">首页</a>
            <a v-for="(item, index) in indexNav" :key="index" @click.prevent="navTo(item.url)">{{ item.name }}</a>
            <a v-if="cartFlag" @click.prevent="navTo('/cart')">购物车</a>
            <a v-if="chatFlag" @click.prevent="navTo('/chat')">在线客服</a>
          </div>
          <div class="header-right" v-if="isLoggedIn()">
            <div class="header-user" @click="centerPage">
              <img v-if="userInfo.touxiang" :src="resolveImg(userInfo.touxiang)" class="header-avatar" />
              <span class="header-username">{{ displayName }}</span>
            </div>
            <a class="header-logout" @click.prevent="logout()">退出</a>
          </div>
          <div class="header-right" v-else>
            <a @click.prevent="navTo('/login')" class="header-login-btn">登录</a>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main id="main-content">
        <router-view></router-view>
      </main>

      <!-- Footer -->
      <footer id="tabbar">
        <div class="company">京ICP备1041289号</div>
      </footer>
    </div>
  `
});

app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });
app.use(router);
app.mixin({ methods: { resolveImg: window.resolveImg } });
app.mount('#app');
