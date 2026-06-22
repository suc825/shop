const ProductList = {
  template: `
<div>
  <!-- Banner -->
  <div style="overflow:hidden;">
    <div class="swiper-container" ref="swiperRef">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in swiperList" :key="index">
          <img style="width:100%;height:100%;object-fit:cover;" :src="resolveImg(item.img)" />
        </div>
      </div>
    </div>
  </div>

  <div style="max-width:1200px;margin:20px auto;padding:0 24px;">
    <!-- Category Filter -->
    <div v-if="categoryList.length > 1" style="margin-bottom:20px;display:flex;gap:8px;flex-wrap:wrap;">
      <el-button :type="swiperIndex === -1 ? 'primary' : 'default'" @click="filterCategory(-1)">全部</el-button>
      <el-button v-for="(item, index) in categoryList" :key="index"
                 :type="swiperIndex === index ? 'primary' : 'default'"
                 @click="filterCategory(index)">{{ item }}</el-button>
    </div>

    <!-- Search -->
    <div style="margin-bottom:24px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;">
      <el-input v-model="searchName" placeholder="商品名称" style="width:220px;" clearable></el-input>
      <el-input v-model="searchPinpai" placeholder="品牌" style="width:220px;" clearable></el-input>
      <el-button type="primary" @click="loadData(1)">搜索</el-button>
      <el-button v-if="isAuth('shangpinxinxi','新增')" type="success" @click="$router.push('/shangpinxinxi/add')">新增</el-button>
    </div>

    <!-- Product Grid -->
    <div class="product-grid" style="grid-template-columns:repeat(4,1fr);">
      <div v-for="(item, index) in dataList" :key="index"
           class="product-card" @click="$router.push('/product/detail?id=' + item.id)"
           style="cursor:pointer;">
        <div class="card-img-wrap" style="aspect-ratio:1/1;">
          <img :src="item.tupian ? resolveImg(item.tupian.split(',')[0]) : ''" alt="" />
        </div>
        <div class="card-body">
          <div class="card-title">{{ item.shangpinmingcheng }}</div>
          <div class="card-price"><span class="currency">¥</span>{{ item.price }}</div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div style="margin-top:30px;display:flex;justify-content:center;">
      <el-pagination background layout="prev, pager, next"
                     :total="total" :page-size="pageSize"
                     :current-page="currentPage"
                     @current-change="loadData"></el-pagination>
    </div>
  </div>
</div>
  `,
  data() {
    return {
      swiperList: [],
      dataList: [],
      categoryList: [],
      swiperIndex: -1,
      searchName: '',
      searchPinpai: '',
      total: 0,
      pageSize: 12,
      currentPage: 1,
      mySwiper: null
    };
  },
  mounted() {
    this.loadSwiper();
    this.loadCategories();
    // 从首页搜索跳转过来
    const q = localStorage.getItem('indexQueryCondition');
    if (q) {
      this.searchName = q;
      localStorage.removeItem('indexQueryCondition');
    }
    this.loadData(1);
  },
  beforeUnmount() {
    if (this.mySwiper) this.mySwiper.destroy();
  },
  methods: {
    isAuth,
    loadSwiper() {
      api.get('config/list', { page: 1, limit: 5 }).then(res => {
        const list = [];
        res.data.list.forEach(item => { if (item.value) list.push({ img: item.value }); });
        this.swiperList = list;
        this.$nextTick(() => {
          if (this.$refs.swiperRef && list.length > 0) {
            this.mySwiper = new Swiper(this.$refs.swiperRef, { loop: true, autoplay: { delay: 3000 } });
          }
        });
      }).catch(() => {});
    },
    loadCategories() {
      api.get('option/shangpinxinxi/shangpinfenlei', {}).then(res => {
        if (res.data) this.categoryList = res.data;
      }).catch(() => {});
    },
    filterCategory(index) {
      this.swiperIndex = index;
      this.loadData(1);
    },
    loadData(page) {
      this.currentPage = page;
      const params = { page, limit: this.pageSize };
      if (this.searchName) params.shangpinmingcheng = this.searchName;
      if (this.searchPinpai) params.pinpai = this.searchPinpai;
      if (this.swiperIndex >= 0 && this.categoryList[this.swiperIndex]) {
        params.shangpinfenlei = this.categoryList[this.swiperIndex];
      }
      api.get('shangpinxinxi/list', params).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载商品列表失败'); });
    }
  }
};
