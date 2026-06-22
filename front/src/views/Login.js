// Inject login page styles into <head>
(function() {
  var style = document.createElement('style');
  style.id = 'login-page-styles';
  style.textContent = `
    .login-page {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #070B14;
      overflow: hidden;
      z-index: 9999;
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .login-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
    }

    .orb-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, #D4A574 0%, #B8860B 40%, transparent 70%);
      top: -15%; left: -10%;
      animation: login-float-orb 20s ease-in-out infinite;
    }

    .orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, #4F94EF 0%, #2563EB 40%, transparent 70%);
      bottom: -10%; right: -5%;
      animation: login-float-orb 25s ease-in-out infinite reverse;
    }

    .orb-3 {
      width: 300px; height: 300px;
      background: radial-gradient(circle, #7C3AED 0%, #5B21B6 40%, transparent 70%);
      top: 50%; left: 60%;
      animation: login-float-orb 18s ease-in-out infinite 3s;
    }

    .orb-4 {
      width: 200px; height: 200px;
      background: radial-gradient(circle, #D4A574 0%, transparent 60%);
      bottom: 20%; left: 15%;
      animation: login-float-orb 22s ease-in-out infinite 6s;
    }

    @keyframes login-float-orb {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -40px) scale(1.05); }
      50% { transform: translate(-20px, 20px) scale(0.95); }
      75% { transform: translate(40px, 30px) scale(1.02); }
    }

    .login-grain {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-repeat: repeat;
      pointer-events: none;
    }

    .login-card {
      width: 420px;
      padding: 48px 40px;
      border-radius: 24px;
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.05) inset,
        0 25px 60px -12px rgba(0, 0, 0, 0.5),
        0 0 120px -20px rgba(212, 165, 116, 0.1);
      animation: login-card-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes login-card-enter {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .form-header {
      text-align: center;
      margin-bottom: 36px;
    }

    .form-brand-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.25em;
      color: #D4A574;
      padding: 6px 16px;
      border: 1px solid rgba(212, 165, 116, 0.25);
      border-radius: 100px;
      margin-bottom: 20px;
      animation: login-fade-in-up 0.6s 0.2s both;
    }

    .form-title {
      font-family: Georgia, 'Noto Serif SC', 'Songti SC', serif;
      font-size: 32px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 8px;
      animation: login-fade-in-up 0.6s 0.3s both;
    }

    .form-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.4);
      animation: login-fade-in-up 0.6s 0.35s both;
    }

    @keyframes login-fade-in-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .input-group {
      margin-bottom: 20px;
    }

    .input-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 8px;
    }

    .login-animate-item {
      animation: login-fade-in-up 0.5s calc(var(--delay, 0s)) both;
    }

    .login-el-form .el-input__wrapper {
      background: rgba(255, 255, 255, 0.04) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 12px !important;
      box-shadow: none !important;
      padding: 4px 16px !important;
      transition: all 0.3s ease !important;
      height: 48px !important;
    }

    .login-el-form .el-input__wrapper:hover {
      border-color: rgba(212, 165, 116, 0.25) !important;
      background: rgba(255, 255, 255, 0.06) !important;
    }

    .login-el-form .el-input__wrapper.is-focus {
      border-color: #D4A574 !important;
      background: rgba(212, 165, 116, 0.06) !important;
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1) !important;
    }

    .login-el-form .el-input__inner {
      color: #FFFFFF !important;
      font-size: 15px !important;
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }

    .login-el-form .el-input__inner::placeholder {
      color: rgba(255, 255, 255, 0.25) !important;
    }

    .login-el-form .el-input__prefix {
      color: rgba(255, 255, 255, 0.35) !important;
    }

    .login-el-form .el-input__password {
      color: rgba(255, 255, 255, 0.35) !important;
    }

    .login-el-form .el-input__password:hover {
      color: #D4A574 !important;
    }

    .login-btn {
      width: 100% !important;
      height: 50px !important;
      border: none !important;
      border-radius: 12px !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      letter-spacing: 0.15em !important;
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif !important;
      background: linear-gradient(135deg, #D4A574 0%, #B8860B 50%, #D4A574 100%) !important;
      background-size: 200% 100% !important;
      color: #0A0E1A !important;
      cursor: pointer !important;
      transition: all 0.4s ease !important;
      margin-top: 8px !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .login-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    .login-btn:hover {
      background-position: 100% 0 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 8px 25px -5px rgba(212, 165, 116, 0.4) !important;
    }

    .login-btn:hover::before {
      transform: translateX(100%);
    }

    .login-btn:active {
      transform: translateY(0) !important;
    }

    .form-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .footer-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }

    .footer-link:hover {
      color: #D4A574;
    }

    .footer-divider {
      width: 1px;
      height: 14px;
      background: rgba(255, 255, 255, 0.1);
    }

    .reset-dialog .el-dialog {
      background: #1a1a2e !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 16px !important;
    }

    .reset-dialog .el-dialog__header { color: #FFFFFF !important; }
    .reset-dialog .el-dialog__title { color: #FFFFFF !important; }
    .reset-dialog .el-dialog__body { color: rgba(255, 255, 255, 0.7) !important; }
    .reset-dialog .el-form-item__label { color: rgba(255, 255, 255, 0.6) !important; }

    .reset-dialog .el-input__wrapper {
      background: rgba(255, 255, 255, 0.06) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: none !important;
    }

    .reset-dialog .el-input__inner { color: #FFFFFF !important; }

    @media (max-width: 480px) {
      .login-card {
        width: 92%;
        padding: 36px 24px;
      }
      .form-title { font-size: 26px; }
      .orb-1, .orb-3 { display: none; }
    }
  `;
  document.head.appendChild(style);
})();

const Login = {
  template: `
<div class="login-page">
  <div class="login-bg">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="orb orb-4"></div>
    <div class="login-grain"></div>
  </div>

  <div class="login-card">
    <div class="form-header">
      <div class="form-brand-badge">ONLINE SHOPPING</div>
      <h2 class="form-title">欢迎回来</h2>
      <p class="form-subtitle">网上商城购物系统</p>
    </div>

    <el-form :model="form" @submit.prevent="onLogin" class="login-el-form">
      <div class="input-group login-animate-item" style="--delay: 0.1s">
        <label class="input-label">用户名</label>
        <el-input v-model="form.username" placeholder="请输入用户名" size="large">
          <template #prefix>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </template>
        </el-input>
      </div>

      <div class="input-group login-animate-item" style="--delay: 0.2s">
        <label class="input-label">密码</label>
        <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" show-password @keyup.enter="onLogin">
          <template #prefix>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </template>
        </el-input>
      </div>

      <div class="login-animate-item" style="--delay: 0.3s">
        <el-button type="primary" size="large" class="login-btn" :loading="loading" @click="onLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登录中...</span>
        </el-button>
      </div>
    </el-form>

    <div class="form-footer login-animate-item" style="--delay: 0.4s">
      <a class="footer-link" @click="showReset = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        忘记密码？
      </a>
      <span class="footer-divider"></span>
      <a class="footer-link" @click="$router.push('/register')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        注册账号
      </a>
    </div>
  </div>

  <el-dialog v-model="showReset" title="找回密码" width="420px" :close-on-click-modal="false" class="reset-dialog">
    <el-form :model="resetForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="resetForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="resetForm.phone" placeholder="请输入注册手机号"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="resetMsg" :style="{color: resetOk ? '#10B981' : '#EF4444', marginBottom: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 500}">{{ resetMsg }}</div>
    <template #footer>
      <el-button @click="showReset = false">取消</el-button>
      <el-button type="primary" :loading="resetLoading" @click="submitReset">确认重置</el-button>
    </template>
  </el-dialog>
</div>
  `,
  data() {
    return {
      form: { username: '', password: '' },
      loading: false,
      showReset: false,
      resetForm: { username: '', phone: '' },
      resetLoading: false,
      resetMsg: '',
      resetOk: false
    };
  },
  methods: {
    onLogin() {
      if (!this.form.username) { ElMessage.error('请输入用户名'); return; }
      if (!this.form.password) { ElMessage.error('请输入密码'); return; }
      this.loading = true;
      api.get('yonghu/login', { username: this.form.username, password: this.form.password }).then(res => {
        localStorage.setItem('Token', res.token);
        localStorage.setItem('role', '管理员');
        localStorage.setItem('userTable', 'yonghu');
        localStorage.setItem('sessionTable', 'yonghu');
        localStorage.setItem('adminName', this.form.username);
        api.get('yonghu/session', {}).then(sessionRes => {
          localStorage.setItem('userid', sessionRes.data.id);
          ElMessage.success('登录成功');
          setTimeout(() => { window.location.href = '/'; }, 300);
        }).catch(() => { ElMessage.error('获取用户信息失败'); this.loading = false; });
      }).catch(() => {}).finally(() => { this.loading = false; });
    },
    submitReset() {
      if (!this.resetForm.username) { this.resetMsg = '请输入用户名'; this.resetOk = false; return; }
      if (!/^1[3-9]\d{9}$/.test(this.resetForm.phone)) { this.resetMsg = '请输入正确的手机号'; this.resetOk = false; return; }
      this.resetLoading = true;
      this.resetMsg = '';
      api.get('yonghu/page', { yonghuming: this.resetForm.username, page: 1, limit: 1 }).then(res => {
        if (res.data.list.length === 0) {
          this.resetMsg = '用户不存在'; this.resetOk = false;
        } else if (res.data.list[0].lianxidianhua !== this.resetForm.phone) {
          this.resetMsg = '手机号不匹配'; this.resetOk = false;
        } else {
          api.postJson('yonghu/resetPass', { username: this.resetForm.username }).then(() => {
            this.resetMsg = '密码已重置为 123456'; this.resetOk = true;
          }).catch(() => { this.resetMsg = '重置失败，请重试'; this.resetOk = false; });
        }
      }).catch(() => {
        this.resetMsg = '请求失败'; this.resetOk = false;
      }).finally(() => { this.resetLoading = false; });
    }
  }
};
