const NewsDetail = {
  template: `
<div style="max-width:900px;margin:20px auto;padding:0 24px;background:#fff;border-radius:12px;border:1px solid #eee;overflow:hidden;">
  <div style="padding:32px 40px 0;">
    <el-button size="small" @click="$router.back()" style="margin-bottom:20px;">返回</el-button>
    <h1 style="font-size:26px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:12px;">{{ detail.title }}</h1>
    <div style="color:#999;font-size:13px;margin-bottom:28px;">{{ detail.addtime }}</div>
  </div>
  <div v-if="detail.picture" style="display:flex;gap:32px;padding:0 40px 32px;align-items:flex-start;">
    <div style="flex:0 0 380px;">
      <img :src="resolveImg(detail.picture)" style="width:100%;border-radius:10px;object-fit:cover;" />
    </div>
    <div style="flex:1;min-width:0;">
      <div v-if="detail.introduction" style="font-size:15px;line-height:1.9;color:#444;margin-bottom:16px;">{{ detail.introduction }}</div>
      <div v-html="detail.content" style="line-height:1.9;color:#333;font-size:15px;"></div>
    </div>
  </div>
  <div v-else style="padding:0 40px 32px;">
    <div v-if="detail.introduction" style="font-size:15px;line-height:1.9;color:#444;margin-bottom:16px;">{{ detail.introduction }}</div>
    <div v-html="detail.content" style="line-height:1.9;color:#333;font-size:15px;"></div>
  </div>
</div>
  `,
  data() { return { detail: {} }; },
  mounted() {
    const id = this.$route.query.id;
    if (id) {
      api.get('news/detail/' + id, {}).then(res => { this.detail = res.data; }).catch(() => { ElMessage.error('加载新闻详情失败'); });
    }
  }
};
