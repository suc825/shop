const YonghuAdd = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">添加用户</h3>
  <el-form label-width="100px">
    <el-form-item label="用户名">
      <el-input v-model="detail.yonghuming"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="detail.mima"></el-input>
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="detail.xingming"></el-input>
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="detail.xingbie" placeholder="请选择">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="头像">
      <el-upload :action="uploadUrl" :headers="uploadHeaders" :on-success="onUploadSuccess"
                 :show-file-list="false" accept="image/*">
        <img v-if="detail.touxiang" :src="resolveImg(detail.touxiang)" style="width:100px;height:100px;border-radius:50%;object-fit:cover;" />
        <el-button v-else type="primary" size="small">上传头像</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model="detail.lianxidianhua"></el-input>
    </el-form-item>
    <el-form-item label="余额">
      <el-input-number v-model="detail.money" :min="0" :precision="2"></el-input-number>
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
      detail: { yonghuming: '', mima: '', xingming: '', xingbie: '', touxiang: '', lianxidianhua: '', money: 0 },
      uploadUrl: api.baseurl + 'file/upload',
      uploadHeaders: { Token: localStorage.getItem('Token') }
    };
  },
  methods: {
    onUploadSuccess(res) {
      if (res.code === 0) {
        this.detail.touxiang = res.file;
      }
    },
    doSubmit() {
      if (!this.detail.yonghuming) { ElMessage.warning('请输入用户名'); return; }
      if (!this.detail.mima) { ElMessage.warning('请输入密码'); return; }
      api.postJson('yonghu/add', this.detail).then(() => {
        ElMessage.success('提交成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('提交失败'); });
    }
  }
};
