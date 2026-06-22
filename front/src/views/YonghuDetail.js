const YonghuDetail = {
  template: `
<div style="max-width:800px;margin:20px auto;padding:0 24px;background:#fff;padding:32px;border-radius:12px;border:1px solid #eee;">
  <el-button size="small" @click="$router.back()" style="margin-bottom:16px;">返回</el-button>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:24px;">用户详情</h1>
  <div style="display:flex;gap:32px;flex-wrap:wrap;">
    <div style="text-align:center;">
      <img :src="resolveImg(detail.touxiang)" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid #eee;" />
    </div>
    <div style="flex:1;min-width:240px;">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ detail.yonghuming }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ detail.xingming }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ detail.xingbie }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detail.lianxidianhua }}</el-descriptions-item>
        <el-descriptions-item label="余额">{{ detail.money }} RMB</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</div>
  `,
  data() { return { detail: {} }; },
  mounted() {
    const id = this.$route.query.id;
    if (id) {
      api.get('yonghu/detail/' + id, {}).then(res => { this.detail = res.data; }).catch(() => { ElMessage.error('加载详情失败'); });
    }
  }
};
