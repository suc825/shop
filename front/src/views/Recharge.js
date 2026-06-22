const Recharge = {
  template: `
<div style="max-width:500px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">余额充值</h3>
  <el-form label-width="80px">
    <el-form-item label="当前余额">
      <span style="color:red;font-size:20px;font-weight:bold;">{{ user.money || 0 }} RMB</span>
    </el-form-item>
    <el-form-item label="充值金额">
      <el-input-number v-model="amount" :min="1" :max="99999" size="large"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="large" style="width:100%;" @click="doRecharge">确认充值</el-button>
    </el-form-item>
  </el-form>
</div>
  `,
  data() {
    return { user: {}, amount: 100 };
  },
  mounted() {
    const table = localStorage.getItem('userTable');
    api.get(table + '/session', {}).then(res => { this.user = res.data; }).catch(() => { ElMessage.error('获取用户信息失败'); });
  },
  methods: {
    doRecharge() {
      this.user.money = Number(this.user.money) + Number(this.amount);
      const table = localStorage.getItem('userTable');
      api.postJson(table + '/update', this.user).then(() => {
        ElMessage.success('充值成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('充值失败'); });
    }
  }
};
