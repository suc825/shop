const DingdanpingjiaList = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">REVIEW</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">订单评价</h2>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:20px;justify-content:center;flex-wrap:wrap;">
    <el-input v-model="search.shangpinmingcheng" placeholder="商品名称" style="width:150px;" @keyup.enter="loadData(1)"></el-input>
    <el-input v-model="search.pinpai" placeholder="品牌" style="width:120px;" @keyup.enter="loadData(1)"></el-input>
    <el-input v-model="search.pingfen" placeholder="评分" style="width:100px;" @keyup.enter="loadData(1)"></el-input>
    <el-input v-model="search.yonghuming" placeholder="用户名" style="width:120px;" @keyup.enter="loadData(1)"></el-input>
    <el-button type="primary" @click="loadData(1)">搜索</el-button>
  </div>
  <el-table :data="dataList" border style="width:100%">
    <el-table-column prop="dingdanbianhao" label="订单编号" width="180"></el-table-column>
    <el-table-column prop="shangpinmingcheng" label="商品名称"></el-table-column>
    <el-table-column prop="shangpinfenlei" label="商品分类" width="120"></el-table-column>
    <el-table-column prop="pinpai" label="品牌" width="100"></el-table-column>
    <el-table-column prop="guige" label="规格" width="100"></el-table-column>
    <el-table-column prop="pingfen" label="评分" width="80" align="center"></el-table-column>
    <el-table-column prop="yonghuming" label="用户名" width="100"></el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="{ row }">
        <el-button type="primary" link @click="$router.push('/dingdanpingjia/detail?id=' + row.id)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top:20px;display:flex;justify-content:center;">
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
                   @current-change="loadData"></el-pagination>
  </div>
</div>
  `,
  data() { return { dataList: [], total: 0, pageSize: 10, search: { shangpinmingcheng: '', pinpai: '', pingfen: '', yonghuming: '' } }; },
  mounted() { this.loadData(1); },
  methods: {
    loadData(page) {
      const params = { page, limit: this.pageSize };
      if (this.search.shangpinmingcheng) params.shangpinmingcheng = '%' + this.search.shangpinmingcheng + '%';
      if (this.search.pinpai) params.pinpai = '%' + this.search.pinpai + '%';
      if (this.search.pingfen) params.pingfen = '%' + this.search.pingfen + '%';
      if (this.search.yonghuming) params.yonghuming = '%' + this.search.yonghuming + '%';
      api.get('dingdanpingjia/list', params).then(res => {
        this.dataList = res.data.list;
        this.total = res.data.total;
      }).catch(() => { ElMessage.error('加载数据失败'); });
    }
  }
};
