const ConfigAdd = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">添加配置</h3>
  <el-form label-width="100px">
    <el-form-item label="名称">
      <el-input v-model="detail.name"></el-input>
    </el-form-item>
    <el-form-item label="值">
      <el-upload :action="uploadUrl" :headers="uploadHeaders" :on-success="onUploadSuccess"
                 :show-file-list="false" accept="image/*">
        <img v-if="detail.value && (detail.value.indexOf('http') === 0 || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(detail.value))" :src="resolveImg(detail.value)" style="width:100px;height:100px;border-radius:8px;object-fit:cover;" />
        <el-button v-else type="primary" size="small">上传图片</el-button>
      </el-upload>
      <el-input v-model="detail.value" style="margin-top:8px;" placeholder="或直接输入值"></el-input>
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
      detail: { name: '', value: '' },
      uploadUrl: api.baseurl + 'file/upload',
      uploadHeaders: { Token: localStorage.getItem('Token') }
    };
  },
  methods: {
    onUploadSuccess(res) {
      if (res.code === 0) {
        this.detail.value = res.file;
      }
    },
    doSubmit() {
      if (!this.detail.name) { ElMessage.warning('请输入名称'); return; }
      api.postJson('config/add', this.detail).then(() => {
        ElMessage.success('提交成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('提交失败'); });
    }
  }
};
