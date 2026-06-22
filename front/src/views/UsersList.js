const UsersList = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">ADMIN</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">管理员</h2>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:20px;justify-content:center;flex-wrap:wrap;">
    <el-input v-model="search.username" placeholder="用户名" style="width:200px;" @keyup.enter="loadData(1)"></el-input>
    <el-button type="primary" @click="loadData(1)">搜索</el-button>
  </div>
  <el-table :data="dataList" border style="width:100%">
    <el-table-column prop="username" label="用户名"></el-table-column>
    <el-table-column prop="role" label="角色" width="150"></el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="{ row }">
        <el-button type="primary" link @click="$router.push('/users/detail?id=' + row.id)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top:20px;display:flex;justify-content:center;">
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                   @current-change="loadData"></el-pagination>
  </div>
</div>
  `,
  data() { return { dataList: [], total: 0, pageSize: 10, search: { username: '' } }; },
  mounted() { this.loadData(1); },
  methods: {
    loadData(page) {
      const params = { page, limit: this.pageSize };
      if (this.search.username) params.username = '%' + this.search.username + '%';
      api.get('users/list', params).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载数据失败'); });
    }
  }
};
