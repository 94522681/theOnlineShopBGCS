<template>
  <el-container>
    <!-- //头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- //侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in listData"
            :key="index"
          >
            <template slot="title">
              <i :class="'iconfont' + ' ' + iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + itemson.path"
              v-for="(itemson, index) in item.children"
              :key="index"
              @click="savaNavState('/' + itemson.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ itemson.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.data$message.error(res.meta.msg)
      this.listData = res.data
      console.log(res)
    },
    // 实现折叠的功能
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    savaNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  data () {
    return {
      listData: {},
      iconList: {
        125: ' icon-user',
        103: ' icon-tijikongjian',
        101: ' icon-shangpin',
        102: ' icon-danju',
        145: ' icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    color: #fff;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-container {
  height: 100%;
}
.iconfont {
  padding-right: 10px;
  z-index: 1000;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
