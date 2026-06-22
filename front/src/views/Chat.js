const Chat = {
  template: `
<div style="max-width:600px;margin:20px auto;padding:0 24px;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;">
  <h3 style="margin-bottom:16px;">在线客服</h3>
  <div style="height:400px;overflow-y:auto;border:1px solid #eee;border-radius:8px;padding:16px;margin-bottom:16px;" ref="chatBox">
    <div v-for="(item, index) in dataList" :key="index" style="margin-bottom:12px;">
      <div v-if="item.ask" style="text-align:right;">
        <el-tag type="primary">我：{{ item.ask }}</el-tag>
      </div>
      <div v-if="item.reply" style="text-align:left;">
        <el-tag type="success">客服：{{ item.reply }}</el-tag>
      </div>
    </div>
  </div>
  <div style="display:flex;gap:12px;">
    <el-input v-model="msg" placeholder="请输入消息" @keyup.enter="send"></el-input>
    <el-button type="primary" @click="send">发送</el-button>
  </div>
</div>
  `,
  data() { return { dataList: [], msg: '', timer: null }; },
  mounted() {
    this.loadList();
    this.timer = setInterval(() => { this.loadList(); }, 10000);
  },
  beforeUnmount() { if (this.timer) clearInterval(this.timer); },
  methods: {
    loadList() {
      api.get('chat/list', { page: 1, limit: 100, userid: localStorage.getItem('userid') }).then(res => {
        this.dataList = res.data.list;
        this.$nextTick(() => {
          const box = this.$refs.chatBox;
          if (box) box.scrollTop = box.scrollHeight;
        });
      }).catch(() => {});
    },
    send() {
      if (!this.msg.trim()) return;
      api.postJson('chat/add', {
        ask: this.msg,
        userid: localStorage.getItem('userid'),
        username: localStorage.getItem('adminName')
      }).then(() => {
        this.msg = '';
        this.loadList();
      }).catch(() => { ElMessage.error('发送失败'); });
    }
  }
};
