<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="openAddDiglog"> 添加分类 </el-button>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        class="mtop"
      >
        <template slot="isdel" slot-scope="scoped">
          <i
            class="el-icon-error"
            v-if="scoped.row.cat_deleted == true"
            style="color: red"
          ></i>
          <i class="el-icon-success" v-else style="color: lightGreen"></i>
        </template>
        <template slot="level" slot-scope="scoped">
          <el-tag size="mini" type="primary" v-if="scoped.row.cat_level == 0"
            >一级</el-tag
          >
          <el-tag
            size="mini"
            type="success"
            v-else-if="scoped.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag
            size="mini"
            type="warning"
            v-else-if="scoped.row.cat_level == 2"
            >三级</el-tag
          >
        </template>
        <template slot="caozuo" slot-scope="scoped">
          <el-button type="success" size="mini" @click="editGoodCate(scoped)"
            >修改</el-button
          >
          <el-button type="danger" size="mini" @click="deteleGoodCate(scoped)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateconfig.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="cateconfig.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加商品用户 -->
      <el-dialog
        title="修改用户"
        :visible.sync="addGoodsCateDialog"
        width="40%"
        @close="addDialogClosed"
      >
        <div>
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="100px"
          >
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级名称">
              <el-cascader
                v-model="chosedCate"
                :options="fatherCateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsCateDialog = false"> 取消</el-button>
          <el-button @click="confirmCate" type="primary"> 确定</el-button>
        </span>
      </el-dialog>

      <!-- 修改功能的Dialog -->
      <!-- 添加商品用户 -->
      <el-dialog
        title="修改用户"
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
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsCateDialog = false"> 取消</el-button>
          <el-button @click="editconfirmCateName" type="primary">
            确定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      chosedCate: [],
      fatherCateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      addGoodsCateDialog: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRules: {
        cat_name: [{
          required: true,
          trigger: 'blur',
          message: '请输入添加分类的名称'
        }]
      },
      total: 0,
      cateList: [],
      columns: [{
        label: '分类名称',
        prop: 'cat_name',
        children: ''
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isdel'
      }, {
        label: '排序',
        type: 'template',
        template: 'level'
      }, {
        label: '操作',
        type: 'template',
        template: 'caozuo'
      }],
      cateconfig: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      editForm: {},
      editFormRules: {},
      editGoodsCateDialog: false

    }
  },
  methods: {
    async getCateList () {
      console.log(this.cateconfig)
      const { data: res } = await this.$http.get('categories', { params: this.cateconfig })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败' + ' ' + res.meta.msg)
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (val) {
      this.cateconfig.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.cateconfig.pagenum = val
      this.getCateList()
    },
    async openAddDiglog () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败' + ' ' + res.meta.msg)
      }
      this.fatherCateList = res.data
      this.addGoodsCateDialog = true
    },
    async confirmCate () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.post('categories', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.addGoodsCateDialog = false
          return this.$message.error('添加分类失败')
        }
        this.getCateList()
        this.$refs.addFormRef.resetFields()
        this.addGoodsCateDialog = false
      })
    },
    handleChange () {
      if (this.chosedCate.length > 0) {
        this.addForm.cat_pid = this.chosedCate[this.chosedCate.length - 1]
        this.addForm.cat_level = this.chosedCate.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
      console.log(this.addForm)
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editGoodCate (scoped) {
      console.log(scoped)
      this.editForm = scoped.row
      this.editGoodsCateDialog = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async editconfirmCateName () {
      console.log(this.editForm)
      const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, {
        cat_name: this.editForm.cat_name
      })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('编辑分类失败' + res.meta.msg)
      }
      this.editGoodsCateDialog = false
      this.getCateList()
    },
    async deteleGoodCate (scoped) {
      console.log(scoped.row.cat_id)
      const { data: res } = await this.$http.delete('categories/' + scoped.row.cat_id)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('编辑分类失败' + res.meta.msg)
      }
      this.getCateList()
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.mtop {
  margin-top: 15px;
}
</style>
