const YonghuList = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">USERS</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">用户</h2>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:20px;justify-content:center;flex-wrap:wrap;">
    <el-input v-model="search.yonghuming" placeholder="用户名" style="width:180px;" @keyup.enter="loadData(1)"></el-input>
    <el-button type="primary" @click="loadData(1)">搜索</el-button>
  </div>
  <div class="news-grid">
    <div v-for="(item, index) in dataList" :key="index" class="news-card" @click="$router.push('/yonghu/detail?id=' + item.id)">
      <div class="news-img"><img :src="resolveImg(item.touxiang)" alt="" /></div>
      <div class="news-body">
        <div>
          <div class="news-title">{{ item.yonghuming }}</div>
          <div class="news-desc">{{ item.xingming }} | {{ item.xingbie }}</div>
        </div>
        <div class="news-footer">
          <div class="news-time">{{ item.lianxidianhua }}</div>
        </div>
      </div>
    </div>
  </div>
  <div style="margin-top:30px;display:flex;justify-content:center;">
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                   @current-change="loadData"></el-pagination>
  </div>
</div>
  `,
  data() { return { dataList: [], total: 0, pageSize: 8, search: { yonghuming: '' } }; },
  mounted() { this.loadData(1); },
  methods: {
    loadData(page) {
      const params = { page, limit: this.pageSize };
      if (this.search.yonghuming) params.yonghuming = '%' + this.search.yonghuming + '%';
      api.get('yonghu/list', params).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载数据失败'); });
    }
  }
};
