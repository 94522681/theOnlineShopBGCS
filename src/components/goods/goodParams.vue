<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <span>选择商品分类:</span>
        <el-cascader
          v-model="chosedOne"
          :options="fatherCateList"
          :props="cascaderProps"
          @change="chosedChange"
          clearable
        ></el-cascader>
      </el-row>
      <!-- 动态参数的tab -->
      <el-tabs v-model="canshuData" @tab-click="clicktab">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isdisabled"
            type="primary"
            size="mini"
            @click="addAttrData"
            >添加参数</el-button
          >
          <el-table :data="manyTable" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <el-tag
                  v-for="(item, index) in scoped.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClosed(index, scoped.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名字"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editTheAttr(scoped.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteTheAttr(scoped.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isdisabled"
            type="primary"
            size="mini"
            @click="jingtaiOpen"
            >添加属性</el-button
          >

          <!-- 静态属性列表 -->
          <el-table :data="onlyTable" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scoped">
                <el-tag
                  v-for="(item, index) in scoped.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClosed(index, scoped.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editTheAttr(scoped.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteTheAttr(scoped.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      :title="'添加' + chosedName"
      :visible.sync="addGoodsAttrDialog"
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
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsAttrDialog = false"> 取消</el-button>
        <el-button type="primary" @click="confirmAdd"> 确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改功能的Dialog -->
    <!-- 添加商品用户 -->
    <el-dialog
      :title="'修改' + chosedName"
      :visible.sync="editGoodsAttrDialog"
      width="40%"
    >
      <div>
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsAttrDialog = false"> 取消</el-button>
        <el-button type="primary" @click="editconfirm"> 确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      editForm: {},
      addForm: {},
      editFormRules: {
        attr_name: [{
          required: true,
          trigger: 'blur',
          message: '请输入属性名'
        }]
      },
      addFormRules: {
        attr_name: [{
          required: true,
          trigger: 'blur',
          message: '请输入属性名'
        }]
      },
      addGoodsAttrDialog: false,
      editGoodsAttrDialog: false,
      onlyTable: [],
      manyTable: [],
      canshuData: 'many',
      chosedOne: [],
      fatherCateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
        // checkStrictly: true
      }
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类数据失败' + res.meta.msg)
      }
      this.fatherCateList = res.data
    },
    // 获取参数的动态或静态的额属性的值
    async getAttrData  () {
      const { data: res } = await this.$http.get(`categories/${this.chosedId}/attributes`, {
        params: {
          sel: this.canshuData
        }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类数据失败' + res.meta.msg)
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.canshuData === 'many') {
        this.manyTable = res.data
      } else {
        this.onlyTable = res.data
      }
    },
    clicktab () {
      if (this.chosedOne.length !== 3) return 0
      this.getAttrData()
    },
    chosedChange () {
      if (this.chosedOne.length !== 3) {
        this.manyTable = []
        this.onlyTable = []
      } else {
        this.getAttrData()
      }
    },
    addDialogClosed () {
      this.addForm = {}
    },
    addAttrData () {
      this.addGoodsAttrDialog = true
    },
    editTheAttr (row) {
      this.editForm = row
      this.editGoodsAttrDialog = true
    },
    async deleteTheAttr (row) {
      console.log(row)
      const result = await this.$confirm(`此操作将永久删除该${this.canshuData}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (result === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${row.cat_id}/attributes/${row.attr_id}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        }
        this.getAttrData()
      }
    },
    confirmAdd () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.post(`categories/${this.chosedId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.canshuData
        })
        if (res.meta.status !== 201) {
          this.$message.error('添加商品属性失败' + res.meta.msg)
        }
        this.getAttrData()
        this.addGoodsAttrDialog = false
      })
    },
    jingtaiOpen () {
      this.addGoodsAttrDialog = true
    },
    async editconfirm () {
      const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`, {
        attr_name: this.editForm.attr_name,
        attr_sel: this.canshuData,
        attr_vals: this.editForm.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        this.$message.error('添加商品属性失败' + res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.editGoodsAttrDialog = false
    },
    showInput (row) {
      row.inputVisible = true
      // $nextTick的作用是等页面渲染完毕之后再执行这行代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (row) {
      console.log(row)
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        return this.$message.error('不能输入为空')
      } else {
        this.editForm = row
        this.editForm.attr_vals.push(row.inputValue)
        this.editconfirm()
        row.inputValue = ''
      }
      row.inputVisible = false
    },
    handleClosed (index, row) {
      row.attr_vals.splice(index, 1)
      this.editForm = row
      this.editconfirm()
    }
  },
  computed: {
    isdisabled () {
      if (this.chosedOne.length === 3) {
        return false
      } else {
        return true
      }
    },
    chosedId () {
      if (this.chosedOne.length === 3) {
        return this.chosedOne[2]
      } else {
        return null
      }
    },
    chosedName () {
      if (this.canshuData === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  margin-left: 10px;
  z-index: 1000;
}

.el-row,
.el-tabs {
  margin-top: 15px;
}
.el-tag {
  margin-right: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>
