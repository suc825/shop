const OrderConfirm = {
  template: `
<div style="max-width:1024px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">CONFIRM / ORDER</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">确认下单</h2>
  </div>

  <!-- Address Selection -->
  <h3 style="margin-bottom:16px;">选择收货地址</h3>
  <el-table :data="addressList" style="width:100%;margin-bottom:16px;" border highlight-current-row
            @current-change="onAddressSelect" ref="addressTable">
    <el-table-column label="选择" width="60" align="center">
      <template #default="{ row, $index }">
        <el-radio v-model="selectedAddress" :value="$index">&nbsp;</el-radio>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="收件人" width="120"></el-table-column>
    <el-table-column prop="phone" label="联系方式" width="160"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>

  <el-button size="small" @click="showAddAddress = !showAddAddress">
    <el-icon><Plus /></el-icon> 新增收货地址
  </el-button>

  <div v-if="showAddAddress" style="margin:16px 0;padding:16px;border:1px solid #eee;border-radius:8px;">
    <el-form :model="newAddress" label-width="80px" size="small">
      <el-form-item label="收件人"><el-input v-model="newAddress.name"></el-input></el-form-item>
      <el-form-item label="联系方式"><el-input v-model="newAddress.phone"></el-input></el-form-item>
      <el-form-item label="地址"><el-input v-model="newAddress.address"></el-input></el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="addAddress">保存</el-button>
        <el-button size="small" @click="showAddAddress = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- Order Items -->
  <h3 style="margin:24px 0 16px;">清单列表</h3>
  <el-table :data="dataList" style="width:100%;" border>
    <el-table-column label="购买商品" min-width="250">
      <template #default="{ row }">
        <div style="display:flex;align-items:center;gap:10px;">
          <img :src="resolveImg(row.picture)" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
          <span>{{ row.goodname }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="价格" width="120" align="center">
      <template #default="{ row }">{{ row.price }} RMB</template>
    </el-table-column>
    <el-table-column label="数量" width="100" align="center" prop="buynumber"></el-table-column>
    <el-table-column label="总价" width="120" align="center">
      <template #default="{ row }">{{ (row.price * row.buynumber).toFixed(2) }} RMB</template>
    </el-table-column>
  </el-table>

  <div style="display:flex;justify-content:flex-end;align-items:center;gap:20px;margin-top:24px;padding:20px;background:#fff;border-radius:12px;border:1px solid #eee;">
    <span style="font-size:20px;font-weight:bold;color:red;">总价：{{ totalPrice.toFixed(2) }} RMB</span>
    <el-button type="primary" size="large" @click="payClick" :loading="paying">支付</el-button>
  </div>
</div>
  `,
  data() {
    return {
      dataList: [],
      addressList: [],
      selectedAddress: -1,
      user: {},
      showAddAddress: false,
      newAddress: { name: '', phone: '', address: '' },
      paying: false
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.dataList.forEach(item => { total += item.price * item.buynumber; });
      return total;
    }
  },
  mounted() {
    const goods = localStorage.getItem('orderGoods');
    if (goods) this.dataList = JSON.parse(goods);
    this.loadAddresses();
    this.loadUser();
  },
  methods: {
    loadAddresses() {
      api.get('address/list', { userid: localStorage.getItem('userid') }).then(res => {
        this.addressList = res.data.list;
      }).catch(() => { ElMessage.error('加载地址列表失败'); });
    },
    loadUser() {
      const table = localStorage.getItem('userTable');
      api.get(table + '/session', {}).then(res => { this.user = res.data; }).catch(() => { ElMessage.error('获取用户信息失败'); });
    },
    onAddressSelect(row) {
      if (row) {
        this.selectedAddress = this.addressList.indexOf(row);
      }
    },
    addAddress() {
      if (!this.newAddress.name) { ElMessage.error('请输入收件人'); return; }
      if (!this.newAddress.phone) { ElMessage.error('请输入联系方式'); return; }
      if (!this.newAddress.address) { ElMessage.error('请输入地址'); return; }
      api.postJson('address/add', {
        userid: localStorage.getItem('userid'),
        ...this.newAddress
      }).then(() => {
        ElMessage.success('添加成功');
        this.showAddAddress = false;
        this.newAddress = { name: '', phone: '', address: '' };
        this.loadAddresses();
      }).catch(() => { ElMessage.error('添加地址失败'); });
    },
    payClick() {
      if (this.selectedAddress < 0) { ElMessage.error('请选择收货地址'); return; }
      if (this.dataList.length === 0) { ElMessage.error('清单为空'); return; }
      this.paying = true;
      const addr = this.addressList[this.selectedAddress].address;

      if (Number(this.user.money) < Number(this.totalPrice)) {
        this.createOrders(addr, '未支付', () => {
          ElMessage.warning('余额不足，订单已创建，请尽快支付');
          this.paying = false;
          this.$router.push('/order/list');
        }, () => { this.paying = false; });
        return;
      }

      this.createOrders(addr, '未支付', (orderIds) => {
        this.user.money = Number(this.user.money) - Number(this.totalPrice);
        const table = localStorage.getItem('userTable');
        api.postJson(table + '/update', this.user).then(() => {
          let updated = 0;
          orderIds.forEach(orderId => {
            api.get('orders/list', { orderid: orderId, page: 1, limit: 1 }).then(res => {
              if (res.data.list.length > 0) {
                const order = res.data.list[0];
                order.status = '已支付';
                api.postJson('orders/update', order).then(() => {
                  updated++;
                  if (updated >= orderIds.length) {
                    this.dataList.forEach(item => {
                      if (item.id) api.postJson('cart/delete', [item.id]);
                    });
                    ElMessage.success('购买成功');
                    this.paying = false;
                    this.$router.push('/order/list');
                  }
                }).catch(() => { ElMessage.error('订单状态更新失败'); this.paying = false; });
              }
            }).catch(() => { ElMessage.error('查询订单失败'); this.paying = false; });
          });
        }).catch(() => { ElMessage.error('扣款失败'); this.paying = false; });
      }, () => { this.paying = false; });
    },
    createOrders(address, status, callback, onErr) {
      const orderIds = [];
      let created = 0;
      let hasError = false;
      this.dataList.forEach(item => {
        api.get(item.tablename + '/info/' + item.goodid, {}).then(res => {
          if (hasError) return;
          const orderId = genTradeNo();
          orderIds.push(orderId);
          const good = res.data;
          good.alllimittimes = (good.alllimittimes || 0) - item.buynumber;
          api.postJson(item.tablename + '/update', good).then(() => {
            api.postJson('orders/add', {
              orderid: orderId,
              tablename: item.tablename,
              userid: this.user.id,
              goodid: item.goodid,
              goodname: item.goodname,
              picture: item.picture,
              buynumber: item.buynumber,
              price: item.price,
              total: item.price * item.buynumber,
              address: address,
              status: status
            }).then(() => {
              created++;
              if (created >= this.dataList.length) callback(orderIds);
            }).catch(() => { if (!hasError) { hasError = true; ElMessage.error('创建订单失败'); if (onErr) onErr(); } });
          }).catch(() => { if (!hasError) { hasError = true; ElMessage.error('更新库存失败'); if (onErr) onErr(); } });
        }).catch(() => { if (!hasError) { hasError = true; ElMessage.error('获取商品信息失败'); if (onErr) onErr(); } });
      });
    }
  }
};
