const ProductDetail = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <!-- Breadcrumb -->
  <div style="padding:16px 0;display:flex;align-items:center;justify-content:space-between;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a @click.prevent="$router.push('/')">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button v-if="storeupFlag" type="success" size="small" @click="storeUp">取消收藏</el-button>
    <el-button v-else type="warning" size="small" @click="storeUp">点我收藏</el-button>
  </div>

  <!-- Product Info -->
  <div style="display:flex;gap:40px;margin-bottom:40px;">
    <!-- Images -->
    <div style="width:500px;flex-shrink:0;">
      <div class="swiper-container" ref="swiperRef">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in swiperList" :key="index">
            <img style="width:100%;height:400px;object-fit:cover;" :src="resolveImg(item)" />
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>

    <!-- Details -->
    <div style="flex:1;">
      <h1 style="font-size:22px;font-weight:700;margin-bottom:20px;">{{ title }}</h1>
      <div v-if="detail.price" style="padding:10px 0;border-bottom:1px solid #eee;">
        <span style="color:#999;margin-right:12px;">价格：</span>
        <span style="color:red;font-size:24px;font-weight:bold;">{{ detail.price }} RMB</span>
      </div>
      <div v-if="detail.jifen" style="padding:10px 0;border-bottom:1px solid #eee;">
        <span style="color:#999;margin-right:12px;">积分：</span>
        <span style="color:#e91e63;font-size:18px;">{{ detail.jifen }}</span>
      </div>
      <div v-if="detail.shangpinfenlei" style="padding:10px 0;border-bottom:1px solid #eee;">
        <span style="color:#999;margin-right:12px;">商品分类：</span>
        <span>{{ detail.shangpinfenlei }}</span>
      </div>
      <div v-if="detail.pinpai" style="padding:10px 0;border-bottom:1px solid #eee;">
        <span style="color:#999;margin-right:12px;">品牌：</span>
        <span>{{ detail.pinpai }}</span>
      </div>
      <div v-if="detail.guige" style="padding:10px 0;border-bottom:1px solid #eee;">
        <span style="color:#999;margin-right:12px;">规格：</span>
        <span>{{ detail.guige }}</span>
      </div>
      <div style="padding:10px 0;border-bottom:1px solid #eee;">
        <span style="color:#999;margin-right:12px;">点击次数：</span>
        <span>{{ detail.clicknum }}</span>
      </div>

      <!-- Quantity + Actions -->
      <div style="display:flex;align-items:center;gap:12px;margin-top:24px;">
        <el-input-number v-model="buynumber" :min="1" size="large"></el-input-number>
        <el-button type="warning" size="large" @click="addCartTap">添加到购物车</el-button>
        <el-button type="primary" size="large" @click="buyTap">立即购买</el-button>
      </div>
    </div>
  </div>

  <!-- Tabs: Detail + Comments -->
  <el-tabs type="border-card">
    <el-tab-pane label="商品详情">
      <div v-html="detail.shangpinxiangqing" style="padding:20px;"></div>
    </el-tab-pane>
    <el-tab-pane label="评论">
      <div style="padding:20px;">
        <el-input v-model="commentContent" type="textarea" :rows="3" placeholder="请输入评论内容"></el-input>
        <el-button type="primary" style="margin-top:12px;" @click="submitComment">立即提交</el-button>
      </div>
      <div style="padding:0 20px 20px;">
        <div v-for="(item, index) in dataList" :key="index" style="padding:16px 0;border-bottom:1px solid #eee;">
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="http://codegen.caihongy.cn/20210112/de962481c19445bcaf7ef2d62f301eaf.jpg"
                 style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
            <span style="color:#999;">{{ item.nickname || item.yonghuming }}</span>
            <span v-if="item.pingfen" style="color:#FF9900;font-size:13px;">
              {{ '★'.repeat(Number(item.pingfen)) }}{{ '☆'.repeat(5 - Number(item.pingfen)) }}
            </span>
          </div>
          <div style="margin:8px 0 0 52px;color:#333;">{{ item.content || item.pingjianeirong }}</div>
          <div v-if="item.tianjiatupian" style="margin:8px 0 0 52px;">
            <img :src="resolveImg(item.tianjiatupian)" style="max-width:120px;max-height:120px;border-radius:6px;object-fit:cover;">
          </div>
          <div v-if="item.reply" style="margin:8px 0 0 52px;color:#e91e63;">回复: {{ item.reply }}</div>
          <div v-if="item.shhf" style="margin:8px 0 0 52px;color:#e91e63;">商家回复: {{ item.shhf }}</div>
        </div>
        <el-pagination v-if="commentTotal > 5" background layout="prev, pager, next"
                       :total="commentTotal" :page-size="5" style="margin-top:20px;"
                       @current-change="loadComments"></el-pagination>
      </div>
    </el-tab-pane>
  </el-tabs>
</div>
  `,
  data() {
    return {
      swiperList: [],
      detail: { id: 0 },
      title: '',
      buynumber: 1,
      detailTable: 'shangpinxinxi',
      dataList: [],
      storeupFlag: 0,
      commentContent: '',
      commentTotal: 0,
      mySwiper: null
    };
  },
  mounted() {
    this.loadDetail();
  },
  beforeUnmount() {
    if (this.mySwiper) this.mySwiper.destroy();
  },
  methods: {
    loadDetail() {
      const id = this.$route.query.id;
      if (!id) return;
      api.get(this.detailTable + '/detail/' + id, {}).then(res => {
        this.detail = res.data;
        this.title = res.data.shangpinmingcheng || '';
        if (res.data.tupian) {
          this.swiperList = res.data.tupian.split(',').filter(Boolean);
        }
        this.$nextTick(() => {
          if (this.$refs.swiperRef && this.swiperList.length > 0) {
            this.mySwiper = new Swiper(this.$refs.swiperRef, {
              loop: true, autoplay: { delay: 3000 },
              pagination: { el: '.swiper-pagination' }
            });
          }
        });
      }).catch(() => { ElMessage.error('加载商品详情失败'); });
      if (localStorage.getItem('Token')) {
        api.get('storeup/list', { page: 1, limit: 1, refid: id, tablename: this.detailTable, userid: localStorage.getItem('userid') }).then(res => {
          this.storeupFlag = res.data.list.length > 0 ? 1 : 0;
        }).catch(() => {});
      }
      this.loadComments(1);
    },
    loadComments(page) {
      const id = this.$route.query.id;
      const name = this.title;
      // 同时加载用户评论和订单评价
      const p1 = api.get('discussshangpinxinxi/list', { page, limit: 5, refid: id }).then(res => res.data).catch(() => ({ list: [], total: 0 }));
      const p2 = name ? api.get('dingdanpingjia/list', { page: 1, limit: 100, shangpinmingcheng: '%' + name + '%' }).then(res => res.data).catch(() => ({ list: [], total: 0 })) : Promise.resolve({ list: [], total: 0 });
      Promise.all([p1, p2]).then(([d1, d2]) => {
        const merged = [...(d1.list || []), ...(d2.list || [])];
        this.dataList = merged;
        this.commentTotal = (d1.total || 0) + (d2.total || 0);
      });
    },
    submitComment() {
      if (!localStorage.getItem('Token')) { window.location.href = '/index.html#/login'; return; }
      if (!this.commentContent.trim()) { ElMessage.error('请输入评论内容'); return; }
      api.postJson('discussshangpinxinxi/save', {
        refid: this.detail.id,
        content: this.commentContent,
        userid: localStorage.getItem('userid'),
        nickname: localStorage.getItem('adminName'),
        tablename: this.detailTable
      }).then(() => {
        ElMessage.success('评论成功');
        this.commentContent = '';
        this.loadComments(1);
      }).catch(() => { ElMessage.error('评论失败'); });
    },
    addCartTap() {
      if (!localStorage.getItem('Token')) { window.location.href = '/index.html#/login'; return; }
      api.get(this.detailTable + '/detail/' + this.detail.id, {}).then(res => {
        const good = res.data;
        if (good.onelimittimes > 0 && good.onelimittimes < this.buynumber) {
          ElMessage.error('每人单次只能购买' + good.onelimittimes + '件'); return;
        }
        const allLimit = good.alllimittimes || 0;
        if (allLimit > 0 && allLimit < this.buynumber) {
          ElMessage.error('库存不足'); return;
        }
        api.postJson('cart/save', {
          tablename: this.detailTable,
          goodid: this.detail.id,
          goodname: this.title,
          picture: this.swiperList[0] || '',
          price: this.detail.price,
          buynumber: this.buynumber,
          userid: localStorage.getItem('userid')
        }).then(() => { ElMessage.success('已加入购物车'); }).catch(() => { ElMessage.error('添加购物车失败'); });
      }).catch(() => { ElMessage.error('获取商品信息失败'); });
    },
    buyTap() {
      if (!localStorage.getItem('Token')) { window.location.href = '/index.html#/login'; return; }
      const orderGoods = [{
        tablename: this.detailTable,
        goodid: this.detail.id,
        goodname: this.title,
        picture: this.swiperList[0] || '',
        price: this.detail.price,
        buynumber: this.buynumber
      }];
      localStorage.setItem('orderGoods', JSON.stringify(orderGoods));
      this.$router.push('/order/confirm');
    },
    storeUp() {
      if (!localStorage.getItem('Token')) { window.location.href = '/index.html#/login'; return; }
      if (this.storeupFlag) {
        api.get('storeup/list', { page: 1, limit: 1, refid: this.detail.id, tablename: this.detailTable, userid: localStorage.getItem('userid') }).then(res => {
          if (res.data.list.length > 0) {
            api.postJson('storeup/delete', [res.data.list[0].id]).then(() => {
              this.storeupFlag = 0;
              ElMessage.success('已取消收藏');
            }).catch(() => { ElMessage.error('取消收藏失败'); });
          }
        }).catch(() => { ElMessage.error('查询收藏状态失败'); });
      } else {
        api.postJson('storeup/save', {
          refid: this.detail.id,
          tablename: this.detailTable,
          name: this.title,
          picture: this.swiperList[0] || '',
          userid: localStorage.getItem('userid'),
          type: 1
        }).then(() => {
          this.storeupFlag = 1;
          ElMessage.success('收藏成功');
        }).catch(() => { ElMessage.error('收藏失败'); });
      }
    }
  }
};
