const OrderList = {
  template: `
<div style="max-width:1200px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">USER / ORDER</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">我的订单</h2>
  </div>

  <el-tabs v-model="status" @tab-change="onTabChange">
    <el-tab-pane label="未支付" name="未支付"></el-tab-pane>
    <el-tab-pane label="已支付" name="已支付"></el-tab-pane>
    <el-tab-pane label="已发货" name="已发货"></el-tab-pane>
    <el-tab-pane label="已完成" name="已完成"></el-tab-pane>
    <el-tab-pane label="已评价" name="已评价"></el-tab-pane>
    <el-tab-pane label="已退款" name="已退款"></el-tab-pane>
    <el-tab-pane label="已取消" name="已取消"></el-tab-pane>
  </el-tabs>

  <el-table :data="dataList" style="width:100%;" border>
    <el-table-column label="订单编号" width="180" prop="orderid"></el-table-column>
    <el-table-column label="商品" min-width="200">
      <template #default="{ row }">
        <div style="display:flex;align-items:center;gap:10px;">
          <img :src="resolveImg(row.picture)" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
          <span>{{ row.goodname }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="价格" width="100" align="center">
      <template #default="{ row }">{{ row.price }} RMB</template>
    </el-table-column>
    <el-table-column label="数量" width="80" align="center" prop="buynumber"></el-table-column>
    <el-table-column label="总价" width="120" align="center">
      <template #default="{ row }">{{ (row.price * row.buynumber).toFixed(2) }} RMB</template>
    </el-table-column>
    <el-table-column label="地址" min-width="150" prop="address" show-overflow-tooltip></el-table-column>
    <el-table-column v-if="status==='未支付'" label="剩余时间" width="100" align="center">
      <template #default="{ row }">
        <span style="color:#FF5722;font-weight:bold;">{{ getCountdown(row.addtime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="{ row }">
        <div style="display:flex;flex-direction:column;gap:4px;align-items:center;">
          <el-button v-if="row.status==='未支付'" type="danger" size="small" @click="pay(row)">立即支付</el-button>
          <el-button v-if="row.status==='未支付'" type="warning" size="small" @click="cancel(row)">取消</el-button>
          <el-button v-if="row.status==='已支付'" type="warning" size="small" @click="refund(row)">退款</el-button>
          <el-button v-if="row.status==='已发货'" type="success" size="small" @click="confirm(row)">确认收货</el-button>
          <el-button v-if="row.status==='已完成'" type="primary" size="small" @click="openReview(row)">评价</el-button>
          <el-button v-if="row.status==='已评价'" type="info" size="small" disabled>已评价</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <div style="margin-top:20px;display:flex;justify-content:center;">
    <el-pagination background layout="prev, pager, next"
                   :total="total" :page-size="pageSize" :current-page="currentPage"
                   @current-change="loadData"></el-pagination>
  </div>

  <!-- 评价对话框 -->
  <el-dialog v-model="reviewVisible" title="商品评价" width="500px">
    <el-form label-width="90px">
      <el-form-item label="商品名称">
        <el-input :model-value="reviewForm.shangpinmingcheng" disabled></el-input>
      </el-form-item>
      <el-form-item label="评分">
        <el-rate v-model="reviewForm.pingfen" :max="5" show-text
                 :texts="['1分','2分','3分','4分','5分']"></el-rate>
      </el-form-item>
      <el-form-item label="评价内容">
        <el-input v-model="reviewForm.pingjianeirong" type="textarea" :rows="4" placeholder="请输入评价内容"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload :action="uploadUrl" :headers="uploadHeaders" :show-file-list="false"
                   :on-success="onReviewImgSuccess" accept="image/*">
          <img v-if="reviewForm.tianjiatupian" :src="resolveImg(reviewForm.tianjiatupian)"
               style="width:80px;height:80px;border-radius:8px;object-fit:cover;" />
          <el-button v-else size="small">上传图片</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="reviewVisible = false">取消</el-button>
      <el-button type="primary" @click="submitReview">提交评价</el-button>
    </template>
  </el-dialog>
</div>
  `,
  data() {
    return {
      dataList: [],
      status: '未支付',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      now: Date.now(),
      timer: null,
      expireCheckCounter: 0,
      reviewVisible: false,
      reviewForm: { shangpinmingcheng: '', pingfen: 5, pingjianeirong: '', tianjiatupian: '', dingdanbianhao: '' },
      reviewOrder: null,
      uploadUrl: api.baseurl + 'file/upload',
      uploadHeaders: { Token: localStorage.getItem('Token') || '' }
    };
  },
  mounted() {
    this.loadData(1);
    this.timer = setInterval(() => {
      this.now = Date.now();
      this.expireCheckCounter++;
      // 每10秒检查一次过期订单
      if (this.expireCheckCounter % 10 === 0 && this.status === '未支付') {
        this.checkExpiredOrders();
      }
    }, 1000);
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    openReview(row) {
      this.reviewOrder = row;
      this.reviewForm = {
        shangpinmingcheng: row.goodname || '',
        pingfen: 5,
        pingjianeirong: '',
        tianjiatupian: '',
        dingdanbianhao: row.orderid || '',
        shangpinfenlei: '',
        pinpai: '',
        guige: ''
      };
      // 从商品表获取分类、品牌、规格
      if (row.tablename && row.goodid) {
        api.get(row.tablename + '/info/' + row.goodid, {}).then(res => {
          const good = res.data || {};
          this.reviewForm.shangpinfenlei = good.shangpinfenlei || '';
          this.reviewForm.pinpai = good.pinpai || '';
          this.reviewForm.guige = good.guige || '';
        }).catch(() => {});
      }
      this.reviewVisible = true;
    },
    onReviewImgSuccess(res) {
      if (res.code === 0) {
        this.reviewForm.tianjiatupian = res.file;
      }
    },
    submitReview() {
      if (!this.reviewForm.pingjianeirong) {
        ElMessage.warning('请输入评价内容');
        return;
      }
      const today = new Date();
      const dateStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
      const data = {
        dingdanbianhao: this.reviewForm.dingdanbianhao,
        shangpinmingcheng: this.reviewForm.shangpinmingcheng,
        shangpinfenlei: this.reviewForm.shangpinfenlei,
        pinpai: this.reviewForm.pinpai,
        guige: this.reviewForm.guige,
        pingfen: String(this.reviewForm.pingfen),
        tianjiatupian: this.reviewForm.tianjiatupian,
        pingjianeirong: this.reviewForm.pingjianeirong,
        pingjiariqi: dateStr,
        yonghuming: localStorage.getItem('adminName') || '',
        sfsh: '否',
        shhf: ''
      };
      api.postJson('dingdanpingjia/add', data).then(() => {
        // 同步插入商品信息评论表
        if (this.reviewOrder && this.reviewOrder.goodid) {
          api.postJson('discussshangpinxinxi/save', {
            refid: this.reviewOrder.goodid,
            userid: localStorage.getItem('userid'),
            nickname: localStorage.getItem('adminName') || '',
            content: this.reviewForm.pingjianeirong
          }).catch(() => {});
        }
        // 更新订单状态为已评价
        if (this.reviewOrder) {
          this.reviewOrder.status = '已评价';
          api.postJson('orders/update', this.reviewOrder).catch(() => {});
        }
        ElMessage.success('评价提交成功');
        this.reviewVisible = false;
        this.loadData(this.currentPage);
      }).catch(() => { ElMessage.error('评价提交失败'); });
    },
    checkExpiredOrders() {
      const now = Date.now();
      const expired = this.dataList.filter(row => {
        if (!row.addtime) return false;
        return new Date(row.addtime).getTime() + 30 * 60 * 1000 < now;
      });
      if (expired.length > 0) {
        const tasks = expired.map(row => {
          row.status = '已取消';
          return api.postJson('orders/update', row).catch(() => {});
        });
        Promise.all(tasks).then(() => {
          this.loadData(this.currentPage);
        });
      }
    },
    onTabChange() {
      this.currentPage = 1;
      this.loadData(1);
    },
    getCountdown(addtime) {
      if (!addtime) return '已过期';
      const expire = new Date(addtime).getTime() + 30 * 60 * 1000;
      const remaining = expire - this.now;
      if (remaining <= 0) return '已过期';
      const m = Math.floor(remaining / 1000 / 60);
      const s = Math.floor((remaining / 1000) % 60);
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    },
    loadData(page) {
      this.currentPage = page;
      api.get('orders/list', {
        page, limit: this.pageSize,
        userid: localStorage.getItem('userid'),
        status: this.status,
        sort: 'addtime',
        order: 'desc'
      }).then(res => {
        const list = res.data.list;
        this.total = res.data.total;

        // 未支付tab：自动取消已过期订单（下单超30分钟）
        if (this.status === '未支付') {
          const now = Date.now();
          const expired = list.filter(row => {
            if (!row.addtime) return false;
            return new Date(row.addtime).getTime() + 30 * 60 * 1000 < now;
          });
          if (expired.length > 0) {
            const tasks = expired.map(row => {
              row.status = '已取消';
              return api.postJson('orders/update', row).catch(() => {});
            });
            Promise.all(tasks).then(() => {
              this.loadData(this.currentPage);
            });
            return;
          }
        }

        this.dataList = list;
      }).catch(() => {
        this.dataList = [];
        this.total = 0;
      });
    },
    pay(item) {
      const totalAmount = (item.price * item.buynumber).toFixed(2);
      api.get(item.tablename + '/info/' + item.goodid, {}).then(goodRes => {
        const table = localStorage.getItem('userTable');
        api.get(table + '/session', {}).then(sessionRes => {
          const user = sessionRes.data;
          if (Number(user.money) < Number(totalAmount)) { ElMessage.error('余额不足，请先充值'); return; }
          if (goodRes.data.jifen) user.jifen = Number(user.jifen) + Number(goodRes.data.jifen * item.buynumber);
          user.money = Number(user.money) - Number(totalAmount);
          api.postJson(table + '/update', user).then(() => {
            item.status = '已支付';
            api.postJson('orders/update', item).then(() => {
              ElMessage.success('支付成功');
              this.loadData(this.currentPage);
            }).catch(() => { ElMessage.error('支付失败，请重试'); });
          }).catch(() => { ElMessage.error('扣款失败'); });
        }).catch(() => { ElMessage.error('获取用户信息失败'); });
      }).catch(() => { ElMessage.error('获取商品信息失败'); });
    },
    refund(item) {
      const totalAmount = (item.price * item.buynumber).toFixed(2);
      api.get(item.tablename + '/info/' + item.goodid, {}).then(goodRes => {
        const table = localStorage.getItem('userTable');
        api.get(table + '/session', {}).then(sessionRes => {
          const user = sessionRes.data;
          if (goodRes.data.jifen) user.jifen = Number(user.jifen) - Number(goodRes.data.jifen * item.buynumber);
          user.money = Number(user.money) + Number(totalAmount);
          api.postJson(table + '/update', user).then(() => {
            item.status = '已退款';
            api.postJson('orders/update', item).then(() => {
              ElMessage.success('退款成功');
              this.loadData(this.currentPage);
            }).catch(() => { ElMessage.error('退款失败'); });
          }).catch(() => { ElMessage.error('退款到账失败'); });
        }).catch(() => { ElMessage.error('获取用户信息失败'); });
      }).catch(() => { ElMessage.error('获取商品信息失败'); });
    },
    confirm(item) {
      item.status = '已完成';
      api.postJson('orders/update', item).then(() => {
        ElMessage.success('确认收货成功');
        this.loadData(this.currentPage);
      }).catch(() => { ElMessage.error('确认收货失败'); });
    },
    cancel(item) {
      ElMessageBox.confirm('确定取消该订单？', '提示', { type: 'warning' }).then(() => {
        item.status = '已取消';
        api.postJson('orders/update', item).then(() => {
          ElMessage.success('订单取消成功');
          this.loadData(this.currentPage);
        }).catch(() => { ElMessage.error('取消失败'); });
      }).catch(() => {});
    }
  }
};
