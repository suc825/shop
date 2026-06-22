const ConfigDetail = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:32px;border-radius:12px;border:1px solid #eee;">
  <el-button size="small" @click="$router.back()" style="margin-bottom:16px;">返回</el-button>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:24px;">配置详情</h1>
  <el-descriptions :column="1" border>
    <el-descriptions-item label="名称">{{ detail.name }}</el-descriptions-item>
    <el-descriptions-item label="值">
      <img v-if="detail.value && (detail.value.indexOf('http') === 0 || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(detail.value))" :src="resolveImg(detail.value)" style="max-width:200px;border-radius:8px;" />
      <span v-else>{{ detail.value }}</span>
    </el-descriptions-item>
  </el-descriptions>
</div>
  `,
  data() { return { detail: {} }; },
  mounted() {
    const id = this.$route.query.id;
    if (id) {
      api.get('config/detail/' + id, {}).then(res => { this.detail = res.data; }).catch(() => { ElMessage.error('加载详情失败'); });
    }
  }
};
