<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色的按钮 -->
      <el-button type="primary" @click="addRoleDialog = true">
        添加角色</el-button
      >
      <!-- 主题表格 -->
      <el-table :data="rolesList" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, i1) in scope.row.children"
              :key="item.id"
              class="vcenter"
            >
              <el-col :span="5">
                <el-tag
                  :class="['bdbottom', i1 == 0 ? 'bdtop' : '']"
                  closable
                  @close="deleteRightById(scope.row, item.id)"
                  >{{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item, i2) in item.children"
                  :class="[i2 !== 0 ? 'bdtop' : '', 'vcenter']"
                  :key="item.id"
                >
                  <el-col :span="6" class="vcenter">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightById(scope.row, item.id)"
                      >{{ item.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item in item.children"
                      :key="item.id"
                      type="warning"
                      closable
                      @close="deleteRightById(scope.row, item.id)"
                      >{{ item.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="rightConfirm(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的dialog -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialog"
      width="40%"
      :before-close="addRoleDialogClosedConfirm"
    >
      <el-form
        :model="addRoleForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <el-form slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRoleDialog" width="40%">
      <el-form
        :model="editRoleList"
        ref="editRoleRef"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名字" prop="roleName">
          <el-input v-model="editRoleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <el-form slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 权限树 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightTreeDialog"
      width="40%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightTreeData"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="keyArr"
        node-key="id"
        ref="treeRef"
      ></el-tree>
      <el-form slot="footer" class="dialog-footer">
        <el-button @click="rightTreeDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmRight">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {

  data () {
    return {
      roleId: '',
      keyArr: [],
      rightTreeData: [],
      rightTreeDialog: false,
      rolesList: [],
      // addRoleDialog界面是否可见
      addRoleDialog: false,
      editRoleDialog: false,
      editRoleList: {},
      addRoleForm: {},
      addFormRules: {
        roleName: [{
          required: true,
          trigger: 'blur',
          message: '请输入角色的名字'
        }, {
          max: 15,
          message: '角色名称的长度应该在3~10之间',
          trigger: 'blur'
        }],
        roleDesc: [{
          required: true,
          message: '请输入角色描述',
          trigger: 'blur'
        }, {
          min: 3,
          message: '角色描述的长度要大于3',
          trigger: 'blur'
        }]
      },
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },

  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$this.message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    addRoleDialogClosedConfirm (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 添加用户确认点击事件
    addRoles () {
      // 1.进行表单校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.addRoleDialog = false
        this.$refs.addFormRef.resetFields()
        this.getRolesList()
      })
      console.log(this.addRoleForm)
      // const { data: res } = await this.$http.post('')
    },
    // 根据id获取角色数据
    async openEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取这个角色的数据失败')
      }
      this.editRoleList = res.data
      this.editRoleDialog = true
    },
    // 确认添加角色
    editRoles () {
      console.log(this.editRoleList)
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return 0
        const { data: res } = await this.$http.put('roles/' + this.editRoleList.roleId, this.editRoleList)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('添加角色失败')
        }
        this.editRoleDialog = false
        this.$refs.editRoleRef.resetFields()
        this.getRolesList()
      })
    },
    // 根据Id删除角色
    async deleteRoleById (id) {
      console.log(id)
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败' + res.meta.msg)
      }
      this.getRolesList()
    },
    // 删除权限事件
    async deleteRightById (scope, id) {
      console.log(id)
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${scope.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败' + res.meta.msg)
      }
      scope.children = res.data
    },
    async rightConfirm (row) {
      this.roleId = row.id
      console.log(12)
      this.rightTreeDialog = true
      // 获取数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败' + res.meta.msg)
      }
      this.rightTreeData = res.data
      console.log(row)
      this.getRightId(row)
      console.log(this.keyArr)
    },
    // 得到所有勾选的数组
    getRightId (obj) {
      if (!obj.children) {
        return this.keyArr.push(obj.id)
      }
      obj.children.forEach(item => {
        this.getRightId(item)
      })
    },
    setRightDialogClosed () {
      this.keyArr = []
    },
    // 确认授权
    async confirmRight () {
      var arr = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      var idStr = arr.join(',')
      console.log(arr)
      console.log(idStr)
      console.log(this.roleId)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('给用户赋予权限失败' + res.meta.msg)
      }
      this.rightTreeDialog = false
      this.getRolesList()
    }
  },
  created () {
    this.getRolesList()
  }

}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbotton {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
