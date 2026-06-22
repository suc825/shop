const Home = {
  template: `
<div>
  <!-- Banner -->
  <div class="banner">
    <div class="swiper-container" ref="swiperRef">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in swiperList" :key="index">
          <img style="width:100%;height:100%;object-fit:cover;" :src="resolveImg(item.img)" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>

  <!-- Search -->
  <div class="search-section">
    <input type="text" v-model="searchName" placeholder="搜索商品名称..." @keyup.enter="goSearch">
    <el-button type="primary" size="large" @click="goSearch">搜索</el-button>
  </div>

  <!-- Product Recommendation -->
  <div style="padding:64px 0;background:#fff;">
    <div style="max-width:1200px;margin:0 auto;padding:0 24px;">
      <div style="text-align:center;margin-bottom:44px;">
        <span style="display:block;font-size:12px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);margin-bottom:10px;opacity:0.8;">Recommend</span>
        <span style="display:block;font-size:28px;font-weight:700;color:var(--text-primary);">商品推荐</span>
      </div>
      <div class="product-grid">
        <div v-for="(item, index) in shangpinxinxiRecommend" :key="index"
             class="product-card" @click="$router.push('/product/detail?id=' + item.id)">
          <div class="card-img-wrap">
            <img :src="item.tupian ? resolveImg(item.tupian.split(',')[0]) : ''" alt="" />
          </div>
          <div class="card-body">
            <div class="card-title">{{ item.shangpinmingcheng }}</div>
            <div class="card-price"><span class="currency">¥</span>{{ item.price }}</div>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:40px;">
        <el-button @click="$router.push('/product/list')">查看更多</el-button>
      </div>
    </div>
  </div>

  <!-- News Section -->
  <div style="padding:64px 0;background:var(--bg-secondary);">
    <div style="max-width:1200px;margin:0 auto;padding:0 24px;">
      <div style="text-align:center;margin-bottom:44px;">
        <span style="display:block;font-size:12px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);margin-bottom:10px;opacity:0.8;">Latest News</span>
        <span style="display:block;font-size:28px;font-weight:700;color:var(--text-primary);">商品资讯</span>
      </div>
      <div class="news-grid">
        <div v-for="(item, index) in newsList" :key="index" class="news-card" @click="$router.push('/news/detail?id=' + item.id)">
          <div class="news-img">
            <img :src="resolveImg(item.picture)" alt="" />
          </div>
          <div class="news-body">
            <div>
              <div class="news-title">{{ item.title }}</div>
              <div class="news-desc">{{ newsDesc(item.introduction) }}</div>
            </div>
            <div class="news-footer">
              <div class="news-time">{{ item.addtime }}</div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:40px;">
        <el-button @click="$router.push('/news/list')">查看更多资讯</el-button>
      </div>
    </div>
  </div>
</div>
  `,
  data() {
    return {
      swiperList: [],
      shangpinxinxiRecommend: [],
      newsList: [],
      searchName: '',
      mySwiper: null
    };
  },
  mounted() {
    this.loadData();
  },
  beforeUnmount() {
    if (this.mySwiper) {
      this.mySwiper.destroy();
    }
  },
  methods: {
    newsDesc(val) {
      if (!val) return '';
      val = val.replace(/<[^<>]+>/g, '').replace(/undefined/g, '');
      if (val.length > 80) val = val.substring(0, 80) + '...';
      return val;
    },
    goSearch() {
      localStorage.setItem('indexQueryCondition', this.searchName);
      this.$router.push('/product/list');
    },
    loadData() {
      // 轮播图
      api.get('config/list', { page: 1, limit: 5 }).then(res => {
        const list = [];
        res.data.list.forEach(item => {
          if (item.value) list.push({ img: item.value });
        });
        this.swiperList = list;
        this.$nextTick(() => {
          if (this.$refs.swiperRef && list.length > 0) {
            this.mySwiper = new Swiper(this.$refs.swiperRef, {
              loop: true,
              autoplay: { delay: 4000 },
              pagination: { el: '.swiper-pagination' }
            });
          }
        });
      }).catch(() => {});

      api.get('shangpinxinxi/autoSort', { page: 1 }).then(res => {
        this.shangpinxinxiRecommend = res.data.list;
      }).catch(() => {});

      api.get('news/list', { page: 1, limit: 4, order: 'desc' }).then(res => {
        this.newsList = res.data.list;
      }).catch(() => {});
    }
  }
};
