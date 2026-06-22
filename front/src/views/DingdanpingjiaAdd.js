const DingdanpingjiaAdd = {
  template: `
<div style="max-width:600px;margin:40px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:24px;text-align:center;">添加订单评价</h3>
  <el-form label-width="100px">
    <el-form-item label="订单编号">
      <el-input v-model="detail.dingdanbianhao"></el-input>
    </el-form-item>
    <el-form-item label="商品名称">
      <el-select v-model="detail.shangpinmingcheng" placeholder="请选择" filterable>
        <el-option v-for="item in shangpinmingchengOptions" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品分类">
      <el-input v-model="detail.shangpinfenlei"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-input v-model="detail.pinpai"></el-input>
    </el-form-item>
    <el-form-item label="规格">
      <el-input v-model="detail.guige"></el-input>
    </el-form-item>
    <el-form-item label="评分">
      <el-select v-model="detail.pingfen" placeholder="请选择">
        <el-option v-for="n in 5" :key="n" :label="n + '分'" :value="String(n)"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="添加图片">
      <el-upload :action="uploadUrl" :headers="uploadHeaders" :on-success="onUploadSuccess"
                 :show-file-list="false" accept="image/*">
        <img v-if="detail.tianjiatupian" :src="resolveImg(detail.tianjiatupian)" style="width:100px;height:100px;border-radius:8px;object-fit:cover;" />
        <el-button v-else type="primary" size="small">上传图片</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="评价日期">
      <el-date-picker v-model="detail.pingjiariqi" type="date" value-format="YYYY-MM-DD" placeholder="选择日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model="detail.yonghuming"></el-input>
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
      detail: { dingdanbianhao: '', shangpinmingcheng: '', shangpinfenlei: '', pinpai: '', guige: '', pingfen: '', tianjiatupian: '', pingjiariqi: '', yonghuming: '' },
      shangpinmingchengOptions: [],
      uploadUrl: api.baseurl + 'file/upload',
      uploadHeaders: { Token: localStorage.getItem('Token') }
    };
  },
  mounted() {
    api.get('option/shangpinxinxi/shangpinmingcheng', {}).then(res => {
      this.shangpinmingchengOptions = res.data || [];
    }).catch(() => {});
  },
  methods: {
    onUploadSuccess(res) {
      if (res.code === 0) {
        this.detail.tianjiatupian = res.file;
      }
    },
    doSubmit() {
      api.postJson('dingdanpingjia/add', this.detail).then(() => {
        ElMessage.success('提交成功');
        this.$router.back();
      }).catch(() => { ElMessage.error('提交失败'); });
    }
  }
};
