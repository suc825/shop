const ShangpinxinxiAdd = {
  template: `
<div style="max-width:700px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">添加商品</h3>
  <el-form label-width="110px">
    <el-form-item label="商品名称">
      <el-input v-model="detail.shangpinmingcheng"></el-input>
    </el-form-item>
    <el-form-item label="商品分类">
      <el-select v-model="detail.shangpinfenlei" placeholder="请选择" filterable>
        <el-option v-for="item in shangpinfenleiOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图片">
      <el-upload :action="uploadUrl" :headers="uploadHeaders" :on-success="onTupianSuccess"
                 :show-file-list="false" accept="image/*">
        <img v-if="detail.tupian" :src="resolveImg(detail.tupian)" style="width:120px;height:120px;border-radius:8px;object-fit:cover;" />
        <el-button v-else type="primary" size="small">上传图片</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="品牌">
      <el-input v-model="detail.pinpai"></el-input>
    </el-form-item>
    <el-form-item label="规格">
      <el-input v-model="detail.guige"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input-number v-model="detail.price" :min="0" :precision="2"></el-input-number>
    </el-form-item>
    <el-form-item label="商品详情">
      <el-input v-model="detail.shangpinxiangqing" type="textarea" :rows="6"></el-input>
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
      detail: { shangpinmingcheng: '', shangpinfenlei: '', tupian: '', pinpai: '', guige: '', shangpinxiangqing: '', price: 0 },
      shangpinfenleiOptions: [],
      uploadUrl: api.baseurl + 'file/upload',
      uploadHeaders: { Token: localStorage.getItem('Token') }
    };
  },
  mounted() {
    api.get('option/shangpinxinxi/shangpinfenlei', {}).then(res => {
      this.shangpinfenleiOptions = res.data || [];
    }).catch(() => {});
  },
  methods: {
    onTupianSuccess(res) {
      if (res.code === 0) {
        this.detail.tupian = res.file;
      }
    },
    doSubmit() {
      if (!this.detail.shangpinmingcheng) { ElMessage.warning('请输入商品名称'); return; }
      api.postJson('shangpinxinxi/add', this.detail).then(() => {
        ElMessage.success('提交成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('提交失败'); });
    }
  }
};
