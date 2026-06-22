const Cart = {
  template: `
<div style="max-width:1024px;margin:20px auto;padding:0 24px;">
  <div style="text-align:center;padding:20px 0;">
    <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:var(--primary);">SHOP / CART</span>
    <h2 style="font-size:28px;font-weight:700;margin-top:8px;">购物车</h2>
  </div>

  <el-table :data="dataList" style="width:100%;" border class="cart-table">
    <el-table-column label="购买商品" min-width="260">
      <template #default="{ row }">
        <div class="cart-product">
          <img :src="resolveImg(row.picture)" class="cart-img" />
          <span class="cart-name">{{ row.goodname }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="价格" width="120" align="center">
      <template #default="{ row }">{{ row.price }} RMB</template>
    </el-table-column>
    <el-table-column label="数量" width="160" align="center">
      <template #default="{ row, $index }">
        <el-input-number v-model="row.buynumber" :min="1" size="small"
                         @change="onNumChange($index)"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column label="总价" width="120" align="center">
      <template #default="{ row }">{{ (row.price * row.buynumber).toFixed(2) }} RMB</template>
    </el-table-column>
    <el-table-column label="操作" width="120" align="center">
      <template #default="{ $index }">
        <el-button type="danger" size="small" @click="deleteCart($index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div style="display:flex;justify-content:flex-end;align-items:center;gap:20px;margin-top:24px;padding:20px;background:#fff;border-radius:12px;border:1px solid #eee;">
    <span style="font-size:20px;font-weight:bold;color:red;">总价：{{ totalPrice }} RMB</span>
    <el-button type="primary" size="large" @click="buyClick">
      <el-icon><ShoppingCart /></el-icon> 点击购买
    </el-button>
  </div>
</div>
  `,
  data() {
    return { dataList: [] };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.dataList.forEach(item => { total += item.price * item.buynumber; });
      return total.toFixed(2);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      api.get('cart/list', { page: 1, limit: 100, userid: localStorage.getItem('userid') }).then(res => {
        this.dataList = res.data.list;
      }).catch(() => { ElMessage.error('加载购物车失败'); });
    },
    onNumChange(index) {
      const item = this.dataList[index];
      api.get(item.tablename + '/info/' + item.goodid, {}).then(res => {
        const good = res.data;
        if (good.onelimittimes > 0 && good.onelimittimes < item.buynumber) {
          ElMessage.error('每人单次只能购买' + good.onelimittimes + '件');
          item.buynumber = good.onelimittimes;
          return;
        }
        const allLimit = good.alllimittimes || 0;
        if (allLimit > 0 && allLimit < item.buynumber) {
          ElMessage.error('库存不足');
          item.buynumber = allLimit;
          return;
        }
        api.postJson('cart/update', item).catch(() => { ElMessage.error('更新数量失败'); });
      }).catch(() => { ElMessage.error('获取商品信息失败'); });
    },
    deleteCart(index) {
      const item = this.dataList[index];
      ElMessageBox.confirm('确定删除该商品？', '提示', { type: 'warning' }).then(() => {
        api.postJson('cart/delete', [item.id]).then(() => {
          ElMessage.success('删除成功');
          this.loadData();
        }).catch(() => { ElMessage.error('删除失败'); });
      }).catch(() => {});
    },
    buyClick() {
      if (this.dataList.length === 0) { ElMessage.warning('购物车为空'); return; }
      localStorage.setItem('orderGoods', JSON.stringify(this.dataList));
      this.$router.push('/order/confirm');
    }
  }
};
