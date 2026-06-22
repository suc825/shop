const Center = {
  template: `
<div style="max-width:1024px;margin:20px auto;padding:0 24px;display:flex;gap:24px;">
  <!-- Sidebar Menu -->
  <div style="width:200px;flex-shrink:0;">
    <el-menu :default-active="$route.path" @select="navTo">
      <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.url">
        {{ item.name }}
      </el-menu-item>
      <el-menu-item index="logout" style="color:#F56C6C;">退出登录</el-menu-item>
    </el-menu>
  </div>

  <!-- Profile Form -->
  <div style="flex:1;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
    <h3 style="margin-bottom:24px;">个人中心</h3>
    <el-form :model="user" label-width="100px" style="max-width:500px;">
      <el-form-item label="头像">
        <el-upload :action="uploadUrl" :headers="uploadHeaders" :show-file-list="false"
                   :on-success="onAvatarSuccess" accept="image/*">
          <img v-if="user.touxiang" :src="resolveImg(user.touxiang)" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">
          <el-button v-else size="small">上传头像</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="user.yonghuming" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.xingming"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="user.xingbie" placeholder="请选择">
          <el-option v-for="item in xingbieList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="user.lianxidianhua"></el-input>
      </el-form-item>
      <el-form-item label="余额">
        <span style="color:red;font-weight:bold;">{{ user.money }} RMB</span>
        <el-button type="primary" size="small" style="margin-left:12px;" @click="showRecharge = true">充值</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- Recharge Dialog -->
  <el-dialog v-model="showRecharge" title="余额充值" width="400px">
    <el-form label-width="80px">
      <el-form-item label="充值金额">
        <el-input-number v-model="rechargeAmount" :min="1" :max="99999"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showRecharge = false">取消</el-button>
      <el-button type="primary" @click="doRecharge">确认充值</el-button>
    </template>
  </el-dialog>
</div>
  `,
  data() {
    return {
      user: {},
      xingbieList: ['男', '女'],
      menuList: centerMenu,
      showRecharge: false,
      rechargeAmount: 100,
      uploadUrl: api.baseurl + 'file/upload',
      uploadHeaders: { Token: localStorage.getItem('Token') || '' }
    };
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    navTo(index) {
      if (index === 'logout') {
        localStorage.clear();
        this.$router.push('/login');
      } else {
        this.$router.push(index);
      }
    },
    loadUser() {
      const table = localStorage.getItem('userTable');
      api.get(table + '/session', {}).then(res => { this.user = res.data; }).catch(() => { ElMessage.error('获取用户信息失败'); });
    },
    saveUser() {
      const table = localStorage.getItem('userTable');
      api.postJson(table + '/update', this.user).then(() => {
        ElMessage.success('保存成功');
      }).catch(() => { ElMessage.error('保存失败'); });
    },
    onAvatarSuccess(res) {
      this.user.touxiang = res.file;
      ElMessage.success('头像上传成功');
    },
    doRecharge() {
      this.user.money = Number(this.user.money) + Number(this.rechargeAmount);
      const table = localStorage.getItem('userTable');
      api.postJson(table + '/update', this.user).then(() => {
        ElMessage.success('充值成功');
        this.showRecharge = false;
      }).catch(() => { ElMessage.error('充值失败'); });
    }
  }
};
