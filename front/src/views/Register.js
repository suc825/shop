const Register = {
  template: `
<div class="login-page">
  <div class="login-card">
    <h2 style="font-size:24px;font-weight:700;margin-bottom:8px;text-align:center;">用户注册</h2>
    <p style="font-size:14px;color:#999;margin-bottom:32px;text-align:center;">网上商城购物系统</p>

    <el-form :model="form" @submit.prevent="onRegister">
      <el-form-item>
        <el-input v-model="form.yonghuming" placeholder="请输入用户名" size="large"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.mima" type="password" placeholder="请输入密码" size="large" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.xingming" placeholder="请输入姓名" size="large"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.lianxidianhua" placeholder="请输入手机号" size="large"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" style="width:100%;" :loading="loading" @click="onRegister">注册</el-button>
      </el-form-item>
      <div style="text-align:center;margin-top:8px;">
        <el-link type="primary" @click="$router.push('/login')">已有账号？去登录</el-link>
      </div>
    </el-form>
  </div>
</div>
  `,
  data() {
    return {
      form: { yonghuming: '', mima: '', xingming: '', lianxidianhua: '' },
      loading: false
    };
  },
  methods: {
    onRegister() {
      if (!this.form.yonghuming) { ElMessage.error('请输入用户名'); return; }
      if (!this.form.mima) { ElMessage.error('请输入密码'); return; }
      this.loading = true;
      api.postJson('yonghu/register', this.form).then(res => {
        ElMessage.success('注册成功');
        this.$router.push('/login');
      }).catch(() => { ElMessage.error('注册失败'); }).finally(() => { this.loading = false; });
    }
  }
};
