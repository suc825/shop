const ConfigList = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">CONFIG</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">系统配置</h2>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:20px;justify-content:center;flex-wrap:wrap;">
    <el-input v-model="search.name" placeholder="名称" style="width:200px;" @keyup.enter="loadData(1)"></el-input>
    <el-button type="primary" @click="loadData(1)">搜索</el-button>
  </div>
  <el-table :data="dataList" border style="width:100%">
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column label="值">
      <template #default="{ row }">
        <img v-if="row.value && (row.value.indexOf('http') === 0 || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(row.value))" :src="resolveImg(row.value)" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" />
        <span v-else>{{ row.value }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="{ row }">
        <el-button type="primary" link @click="$router.push('/config/detail?id=' + row.id)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top:20px;display:flex;justify-content:center;">
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                   @current-change="loadData"></el-pagination>
  </div>
</div>
  `,
  data() { return { dataList: [], total: 0, pageSize: 10, search: { name: '' } }; },
  mounted() { this.loadData(1); },
  methods: {
    loadData(page) {
      const params = { page, limit: this.pageSize };
      if (this.search.name) params.name = '%' + this.search.name + '%';
      api.get('config/list', params).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载数据失败'); });
    }
  }
};
