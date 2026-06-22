const AddressList = {
  template: `
<div style="max-width:1024px;margin:20px auto;padding:0 24px;display:flex;gap:24px;">
  <div style="width:200px;flex-shrink:0;">
    <el-menu :default-active="$route.path" @select="navTo">
      <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.url">{{ item.name }}</el-menu-item>
    </el-menu>
  </div>
  <div style="flex:1;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h3>我的地址</h3>
      <el-button type="primary" size="small" @click="$router.push('/address/add')">新增地址</el-button>
    </div>
    <el-table :data="dataList" border>
      <el-table-column prop="name" label="收件人" width="120"></el-table-column>
      <el-table-column prop="phone" label="联系方式" width="160"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="$router.push('/address/update?id=' + row.id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteAddr(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
  `,
  data() {
    return { dataList: [], menuList: centerMenu };
  },
  mounted() { this.loadData(); },
  methods: {
    navTo(index) { this.$router.push(index); },
    loadData() {
      api.get('address/list', { userid: localStorage.getItem('userid') }).then(res => {
        this.dataList = res.data.list;
      }).catch(() => { ElMessage.error('加载地址列表失败'); });
    },
    deleteAddr(row) {
      ElMessageBox.confirm('确定删除该地址？', '提示', { type: 'warning' }).then(() => {
        api.postJson('address/delete', [row.id]).then(() => {
          ElMessage.success('删除成功');
          this.loadData();
        }).catch(() => { ElMessage.error('删除失败'); });
      }).catch(() => {});
    }
  }
};
