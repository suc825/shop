const NewsList = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">NEWS</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">商品资讯</h2>
  </div>
  <div class="news-grid">
    <div v-for="(item, index) in dataList" :key="index" class="news-card" @click="$router.push('/news/detail?id=' + item.id)">
      <div class="news-img"><img :src="resolveImg(item.picture)" alt="" /></div>
      <div class="news-body">
        <div>
          <div class="news-title">{{ item.title }}</div>
          <div class="news-desc">{{ newsDesc(item.introduction) }}</div>
        </div>
        <div class="news-footer"><div class="news-time">{{ item.addtime }}</div></div>
      </div>
    </div>
  </div>
  <div style="margin-top:30px;display:flex;justify-content:center;">
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                   @current-change="loadData"></el-pagination>
  </div>
</div>
  `,
  data() { return { dataList: [], total: 0, pageSize: 10 }; },
  mounted() { this.loadData(1); },
  methods: {
    newsDesc(val) {
      if (!val) return '';
      val = val.replace(/<[^<>]+>/g, '');
      return val.length > 80 ? val.substring(0, 80) + '...' : val;
    },
    loadData(page) {
      api.get('news/list', { page, limit: this.pageSize, order: 'desc' }).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载新闻列表失败'); });
    }
  }
};
