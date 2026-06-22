<template>
  <div class="login-page">
    <div class="bg-gradient"></div>
    <div class="bg-grid"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="login-card">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>

      <h2 class="card-title">管理后台</h2>
      <p class="card-subtitle">网上商城购物系统</p>

      <div class="form-group">
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <input
            class="login-input"
            type="text"
            placeholder="请输入用户名"
            v-model="rulesForm.username"
            @keyup.enter="login()"
          />
        </div>
      </div>

      <div class="form-group">
        <div class="input-wrap">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            class="login-input"
            type="password"
            placeholder="请输入密码"
            v-model="rulesForm.password"
            @keyup.enter="login()"
          />
        </div>
      </div>

      <button class="login-btn" @click="login()" :disabled="loading">
        {{ loading ? '登录中...' : '管理员登录' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      rulesForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      if (!this.rulesForm.username) {
        this.$message.error("请输入用户名");
        return;
      }
      if (!this.rulesForm.password) {
        this.$message.error("请输入密码");
        return;
      }
      this.loading = true;
      this.$http({
        url: `users/login?username=${this.rulesForm.username}&password=${this.rulesForm.password}`,
        method: "post"
      }).then(({ data }) => {
        this.loading = false;
        if (data && data.code === 0) {
          localStorage.setItem("Token", data.token);
          localStorage.setItem("Admin-Token", data.token);
          this.$storage.set("role", "管理员");
          this.$storage.set("sessionTable", "users");
          localStorage.setItem("userTable", "users");
          localStorage.setItem("sessionTable", "users");
          this.$storage.set("adminName", this.rulesForm.username);
          this.$router.replace({ path: "/index/" });
        } else {
          this.$message.error(data.msg);
        }
      }).catch(() => {
        this.loading = false;
        this.$message.error("网络错误，请稍后重试");
      });
    },
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0F172A;
  overflow: hidden;
}

.bg-gradient {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(79, 148, 239, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
  animation: bgFloat 20s ease-in-out infinite;
}

@keyframes bgFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-2%, 3%) rotate(1deg); }
  50% { transform: translate(2%, -2%) rotate(-1deg); }
  75% { transform: translate(-1%, -3%) rotate(0.5deg); }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: orbFloat 15s ease-in-out infinite;
}

.orb-1 { width: 400px; height: 400px; background: rgba(79, 148, 239, 0.12); top: -100px; right: -100px; }
.orb-2 { width: 300px; height: 300px; background: rgba(16, 185, 129, 0.1); bottom: -80px; left: -80px; animation-delay: -5s; }
.orb-3 { width: 200px; height: 200px; background: rgba(139, 92, 246, 0.08); top: 50%; left: 20%; animation-delay: -10s; }

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 30px) scale(0.95); }
}

.login-card {
  position: relative;
  z-index: 10;
  width: 420px;
  padding: 48px 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: cardIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
  text-align: center;
}

@keyframes cardIn { to { opacity: 1; transform: translateY(0); } }

.logo-icon {
  width: 56px; height: 56px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #4F94EF, #10B981);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 24px rgba(79, 148, 239, 0.3);
  animation: logoPulse 3s ease-in-out infinite;
}

.logo-icon svg { width: 28px; height: 28px; color: white; }

@keyframes logoPulse {
  0%, 100% { box-shadow: 0 8px 24px rgba(79, 148, 239, 0.3); }
  50% { box-shadow: 0 8px 32px rgba(79, 148, 239, 0.5); }
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.card-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  transition: color 0.25s ease;
  z-index: 2;
}

.login-input {
  width: 100%;
  height: 50px;
  padding: 0 16px 0 46px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  transition: all 0.25s ease;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.login-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: #4F94EF;
  box-shadow: 0 0 0 3px rgba(79, 148, 239, 0.2);
}

.login-input:focus ~ .input-icon,
.login-input:not(:placeholder-shown) ~ .input-icon {
  color: #4F94EF;
}

.login-input:hover:not(:focus) {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.login-btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #4F94EF 0%, #2563EB 100%);
  border: none;
  border-radius: 12px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.02em;
  margin-top: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 148, 239, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
</style>
