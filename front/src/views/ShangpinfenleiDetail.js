const ShangpinfenleiDetail = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:32px;border-radius:12px;border:1px solid #eee;">
  <el-button size="small" @click="$router.back()" style="margin-bottom:16px;">返回</el-button>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:24px;">商品分类详情</h1>
  <el-descriptions :column="1" border>
    <el-descriptions-item label="商品分类">{{ detail.shangpinfenlei }}</el-descriptions-item>
  </el-descriptions>
</div>
  `,
  data() { return { detail: {} }; },
  mounted() {
    const id = this.$route.query.id;
    if (id) {
      api.get('shangpinfenlei/detail/' + id, {}).then(res => { this.detail = res.data; }).catch(() => { ElMessage.error('加载详情失败'); });
    }
  }
};
