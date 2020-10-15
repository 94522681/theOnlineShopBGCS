<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @keyup.enter.native="getGoodsList"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goadd">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="100">
          <template slot-scope="scoped">{{
            scoped.row.goods_price + "元"
          }}</template>
        </el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="80"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150">
          <template slot-scope="scoped">{{
            scoped.row.add_time | time_format
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scoped.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {

  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodList: [],
      total: 0
    }
  },
  methods: {
    async getGoodsList () {
      console.log(this.queryInfo)
      if (this.queryInfo.query) {
        this.queryInfo.pagenum = this.total
        this.queryInfo.pagenum = 1
      }
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败' + res.meta.msg)
      }
      this.goodList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    async deleteGoods (row) {
      const result = await this.$confirm('此操作将永久删除这个商品', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => console.log(err))
      console.log(result)
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete('goods/' + row.goods_id)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品数据失败' + res.meta.msg)
        }
        this.getGoodsList()
      }
    },
    goadd () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>
