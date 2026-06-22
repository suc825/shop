const ShangpinfenleiAdd = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">添加商品分类</h3>
  <el-form label-width="100px">
    <el-form-item label="商品分类">
      <el-input v-model="detail.shangpinfenlei"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="doSubmit">提交</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </el-form-item>
  </el-form>
</div>
  `,
  data() {
    return { detail: { shangpinfenlei: '' } };
  },
  methods: {
    doSubmit() {
      if (!this.detail.shangpinfenlei) { ElMessage.warning('请输入商品分类'); return; }
      api.postJson('shangpinfenlei/add', this.detail).then(() => {
        ElMessage.success('提交成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('提交失败'); });
    }
  }
};
