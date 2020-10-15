<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <el-steps :active="activeNum" align-center finish-status="success">
        <el-step title="基本信息" icon="el-icon-edit"></el-step>
        <el-step title="商品参数" icon="el-icon-eleme"></el-step>
        <el-step title="商品属性" icon="el-icon-platform-eleme"></el-step>
        <el-step title="商品图片" icon="el-icon-picture"></el-step>
        <el-step title="商品内容" icon="el-icon-edit"></el-step>
        <el-step title="完成" icon="el-icon-success"></el-step>
      </el-steps>
      <el-form
        ref="addformRef"
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          :before-leave="beforeTab"
          v-model="activeName"
        >
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="chosedOne"
                :options="fatherCateList"
                :props="cascaderProps"
                @change="chosedChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabs"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="itemson"
                  v-for="(itemson, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabs"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              class="upload-demo"
              :action="pictureUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              :headers="headerobj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="tianjiabutton" type="primary" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="40%">
      <img :src="imgUrl" alt="" class="theimg" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imgUrl: '',
      headerobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      pictureUrl: 'http://vue-shop-api.itheima.net/api/private/v1/upload',
      manyTabs: [],
      onlyTabs: [],
      activeName: '1',
      chosedOne: [],
      fatherCateList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      addForm: {
        attrs: [],
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        goods_introduce: '',
        pics: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      dialogVisible: false

    }
  },
  methods: {
    chosedChange () {
      this.getAttrData('many')
      this.getAttrData('only')
    },
    // 根据Id查询属性
    async getAttrData (sel) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求分类参数错误')
      }
      if (sel === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTabs = res.data
      } else {
        this.onlyTabs = res.data
      }
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('请求分类参数错误')
      }
      this.fatherCateList = res.data
    },
    beforeTab () {
      console.log(this.cateId)
      if (this.cateId) {
        return true
      } else {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tabclick () {
    //   if (this.activeName === '2') {
    //     this.getAttrData('many')
    //   } else if (this.activeName === '3') {
    //     this.getAttrData('only')
    //   }
    // },
    handlePreview (file) {
      this.imgUrl = file.response.data.url
      this.dialogVisible = true
    },
    handleRemove (file) {
      var tempath = file.response.data.tmp_path
      var index = this.addForm.pics.findIndex(value => {
        return value.pic === tempath
      })
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess (response, file, fileList) {
      const tempic = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(tempic)
    },
    addGoods () {
      this.$refs.addformRef.validate(async valid => {
        if (!valid) {
          this.activeName = '1'
          return 0
        }
        console.log(this.cateId)
        this.addForm.goods_cat = this.chosedOne.join(',')
        this.manyTabs.forEach(item => {
          const tempobj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(tempobj)
        })
        this.onlyTabs.forEach(item => {
          const tempobj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(tempobj)
        })
        const { data: res } = await this.$http.post('goods', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.go(-1)
      })
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    activeNum () {
      return +this.activeName
    },
    cateId () {
      if (this.chosedOne.length === 3) {
        return this.chosedOne[2]
      } else {
        return null
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 8px 0 0;
  z-index: 999;
}
.el-form--intem {
  margin-bottom: 0px;
}
.theimg {
  width: 100%;
}
.tianjiabutton {
  margin-top: 15px;
}
</style>
