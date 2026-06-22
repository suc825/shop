const Favorites = {
  template: `
<div style="max-width:1024px;margin:20px auto;padding:0 24px;display:flex;gap:24px;">
  <div style="width:200px;flex-shrink:0;">
    <el-menu :default-active="$route.path" @select="navTo">
      <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.url">{{ item.name }}</el-menu-item>
    </el-menu>
  </div>
  <div style="flex:1;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
    <h3 style="margin-bottom:16px;">我的收藏</h3>
    <el-table :data="dataList" border>
      <el-table-column label="商品图片" width="100">
        <template #default="{ row }">
          <img :src="resolveImg(row.picture)" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="cancelStore(row)">取消收藏</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > 10" background layout="prev, pager, next"
                   :total="total" :page-size="10" style="margin-top:20px;"
                   @current-change="loadData"></el-pagination>
  </div>
</div>
  `,
  data() {
    return { dataList: [], total: 0, menuList: centerMenu };
  },
  mounted() { this.loadData(1); },
  methods: {
    navTo(index) { this.$router.push(index); },
    loadData(page) {
      api.get('storeup/list', { page, limit: 10, userid: localStorage.getItem('userid') }).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载收藏列表失败'); });
    },
    cancelStore(row) {
      api.postJson('storeup/delete', [row.id]).then(() => {
        ElMessage.success('已取消收藏');
        this.loadData(1);
      }).catch(() => { ElMessage.error('取消收藏失败'); });
    }
  }
};
