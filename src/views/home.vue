<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <img src="../assets/logo.png" alt class="logo">
        <el-menu
          :router="true"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 动态生成左边操作侧边栏 -->

           <el-submenu :index="item.path" v-for="item in leftmenu" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+cccc.path" v-for="cccc in item.children" :key="cccc.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{cccc.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>


        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="myicon myicon-menu toggle-btn"></span>
          <span class="system-title">电商后台管理系统</span>
          <div class="welcome">
            <span>你好：admin</span>
            <a href="javascript:;">退出</a>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getrightsleft } from '../api/rights-index'
export default {
  data () {
    return {
      leftmenu: []
    }
  },
  mounted () {
    this.getrights()
  },
  methods: {
    async getrights () {
      let result = await getrightsleft()
      if (result.data.meta.status === 200) {
        this.leftmenu = result.data.data
        console.log(this.leftmenu)
      }
    },
    handleOpen (key, keypath) {},
    handleClose (key, keypath) {}
  }
}
</script>
<style lang="less">
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
