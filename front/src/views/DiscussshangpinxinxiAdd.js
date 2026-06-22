const DiscussshangpinxinxiAdd = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">添加评论</h3>
  <el-form label-width="100px">
    <el-form-item label="用户名">
      <el-input v-model="detail.nickname"></el-input>
    </el-form-item>
    <el-form-item label="评论内容">
      <el-input v-model="detail.content" type="textarea" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="回复内容">
      <el-input v-model="detail.reply" type="textarea" :rows="3"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="doSubmit">提交</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </el-form-item>
  </el-form>
</div>
  `,
  data() {
    return {
      detail: { refid: '', userid: '', nickname: '', content: '', reply: '', avatarurl: '' }
    };
  },
  methods: {
    doSubmit() {
      api.postJson('discussshangpinxinxi/add', this.detail).then(() => {
        ElMessage.success('提交成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('提交失败'); });
    }
  }
};
