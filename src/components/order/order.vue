<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scoped">
            <el-tag type="success" v-if="+scoped.row.order_pay">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scoped">
            {{ scoped.row.create_time | time_format }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="openEditDialog(scoped)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="openTranslate"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改地址"
      :visible.sync="editGoodsCateDialog"
      width="40%"
      @close="editDialogClosed"
    >
      <div>
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="city">
            <el-cascader
              v-model="editForm.city"
              :options="cityData"
              :props="cascaderProps"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsCateDialog = false"> 取消</el-button>
        <el-button @click="confirmCity" type="primary"> 确定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息 -->
    <el-dialog
      title="修改地址"
      :visible.sync="translateMessageDialog"
      width="40%"
    >
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in translateList"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      translateList: [],
      translateMessageDialog: false,
      editFormRules: {
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        city: [{ required: true, message: '请输入地区', trigger: 'blur' }]
      },
      editForm: {
        address: '',
        city: []
      },
      editGoodsCateDialog: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      cityData,
      cascaderProps: {
        label: 'label',
        value: 'value',
        children: 'children'
      }

    }
  },
  methods: {
    async getOrderData () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      this.total = res.data.total
      this.orderList = res.data.goods
      console.log(res)
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getOrderData()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getOrderData()
    },
    handleChange () {

    },
    openEditDialog () {
      this.editGoodsCateDialog = true
    },
    confirmCity () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return 0
        }
        this.editGoodsCateDialog = false
        this.$refs.editFormRef.resetFields()
      })
    },
    editDialogClosed () {

    },

    // 这个地方有大问题
    async openTranslate () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.translateList = res.data
      console.log(this.translateList)
      this.translateMessageDialog = true
    }
  },
  created () {
    this.getOrderData()
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
