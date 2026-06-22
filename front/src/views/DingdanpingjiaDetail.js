const DingdanpingjiaDetail = {
  template: `
<div style="max-width:800px;margin:20px auto;padding:0 24px;background:#fff;padding:32px;border-radius:12px;border:1px solid #eee;">
  <el-button size="small" @click="$router.back()" style="margin-bottom:16px;">返回</el-button>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:24px;">订单评价详情</h1>
  <div style="display:flex;gap:32px;flex-wrap:wrap;">
    <div v-if="detail.tianjiatupian" style="text-align:center;">
      <img :src="resolveImg(detail.tianjiatupian)" style="width:150px;height:150px;border-radius:8px;object-fit:cover;border:3px solid #eee;" />
    </div>
    <div style="flex:1;min-width:280px;">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单编号">{{ detail.dingdanbianhao }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ detail.shangpinmingcheng }}</el-descriptions-item>
        <el-descriptions-item label="商品分类">{{ detail.shangpinfenlei }}</el-descriptions-item>
        <el-descriptions-item label="品牌">{{ detail.pinpai }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ detail.guige }}</el-descriptions-item>
        <el-descriptions-item label="评分">{{ detail.pingfen }}</el-descriptions-item>
        <el-descriptions-item label="评价日期">{{ detail.pingjiariqi }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ detail.yonghuming }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</div>
  `,
  data() { return { detail: {} }; },
  mounted() {
    const id = this.$route.query.id;
    if (id) {
      api.get('dingdanpingjia/detail/' + id, {}).then(res => { this.detail = res.data; }).catch(() => { ElMessage.error('加载详情失败'); });
    }
  }
};
