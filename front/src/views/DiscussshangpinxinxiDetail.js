const DiscussshangpinxinxiDetail = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:32px;border-radius:12px;border:1px solid #eee;">
  <el-button size="small" @click="$router.back()" style="margin-bottom:16px;">返回</el-button>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:24px;">评论详情</h1>
  <el-descriptions :column="1" border>
    <el-descriptions-item label="用户名">{{ detail.nickname }}</el-descriptions-item>
    <el-descriptions-item label="评论内容">{{ detail.content }}</el-descriptions-item>
    <el-descriptions-item label="回复内容">{{ detail.reply }}</el-descriptions-item>
  </el-descriptions>
</div>
  `,
  data() { return { detail: {} }; },
  mounted() {
    const id = this.$route.query.id;
    if (id) {
      api.get('discussshangpinxinxi/detail/' + id, {}).then(res => { this.detail = res.data; }).catch(() => { ElMessage.error('加载详情失败'); });
    }
  }
};
