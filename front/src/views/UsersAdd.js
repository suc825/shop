const UsersAdd = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">添加管理员</h3>
  <el-form label-width="100px">
    <el-form-item label="用户名">
      <el-input v-model="detail.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="detail.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="角色">
      <el-input v-model="detail.role"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="doSubmit">提交</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </el-form-item>
  </el-form>
</div>
  `,
  data() {
    return { detail: { username: '', password: '', role: '' } };
  },
  methods: {
    doSubmit() {
      if (!this.detail.username) { ElMessage.warning('请输入用户名'); return; }
      if (!this.detail.password) { ElMessage.warning('请输入密码'); return; }
      api.postJson('users/add', this.detail).then(() => {
        ElMessage.success('提交成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('提交失败'); });
    }
  }
};
