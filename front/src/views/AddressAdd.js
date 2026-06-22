const AddressAdd = {
  template: `
<div style="max-width:600px;margin:20px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;">新增地址</h3>
  <el-form :model="form" label-width="80px">
    <el-form-item label="收件人"><el-input v-model="form.name"></el-input></el-form-item>
    <el-form-item label="联系方式"><el-input v-model="form.phone"></el-input></el-form-item>
    <el-form-item label="地址"><el-input v-model="form.address" type="textarea" :rows="2"></el-input></el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </el-form-item>
  </el-form>
</div>
  `,
  data() {
    return { form: { name: '', phone: '', address: '' } };
  },
  methods: {
    onSubmit() {
      if (!this.form.name) { ElMessage.error('请输入收件人'); return; }
      if (!this.form.phone) { ElMessage.error('请输入联系方式'); return; }
      if (!this.form.address) { ElMessage.error('请输入地址'); return; }
      api.postJson('address/add', { userid: localStorage.getItem('userid'), ...this.form, isdefault: '否' }).then(() => {
        ElMessage.success('添加成功');
        this.$router.push('/address/list');
      }).catch(() => { ElMessage.error('添加失败'); });
    }
  }
};
