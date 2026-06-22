const DiscussshangpinxinxiList = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">COMMENT</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">商品评论</h2>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:20px;justify-content:center;flex-wrap:wrap;">
    <el-input v-model="search.nickname" placeholder="用户名" style="width:180px;" @keyup.enter="loadData(1)"></el-input>
    <el-button type="primary" @click="loadData(1)">搜索</el-button>
  </div>
  <el-table :data="dataList" border style="width:100%">
    <el-table-column prop="nickname" label="用户名" width="120"></el-table-column>
    <el-table-column prop="content" label="评论内容" show-overflow-tooltip></el-table-column>
    <el-table-column prop="reply" label="回复内容" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="{ row }">
        <el-button type="primary" link @click="$router.push('/discussshangpinxinxi/detail?id=' + row.id)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top:20px;display:flex;justify-content:center;">
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                   @current-change="loadData"></el-pagination>
  </div>
</div>
  `,
  data() { return { dataList: [], total: 0, pageSize: 10, search: { nickname: '' } }; },
  mounted() { this.loadData(1); },
  methods: {
    loadData(page) {
      const params = { page, limit: this.pageSize };
      if (this.search.nickname) params.nickname = '%' + this.search.nickname + '%';
      api.get('discussshangpinxinxi/list', params).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载数据失败'); });
    }
  }
};
