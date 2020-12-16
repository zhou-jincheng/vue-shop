<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="name">
        <img src="../assets/images/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$router.path"
        >
        <div class="menus-collapse" @click="collpaseMenus">|||</div>
          <!-- 第一级 -->
          <el-submenu :index="item1.path + ''" v-for="item1 in menus" :key="item1.id">
            <template slot="title">
              <i :class="menusIcons[item1.id]"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!-- 第二级 -->
            <el-menu-item :index="'/home/' + item2.path" v-for="item2 in item1.children" :key="item2.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from "../network/request";
export default {
  data() {
    return {
      menus: [],
      menusIcons: {
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '103': 'iconfont icon-tijikongjian',
        '125': 'iconfont icon-user',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
    };
  },
  created() {
    //获取权限列表
    this.getMenus();
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
    async getMenus() {
      let { data: res } = await request("rights/tree");
      this.menus = res.data;
      // console.log(res);
    },
    // 折叠菜单栏
    collpaseMenus() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  .name {
    font-size: 20px;
    color: #fff;
    display: flex;
    align-items: center;
    > span {
      margin-left: 5px;
    }
  }
}
.el-aside {
  .iconfont {
    margin-right: 10px;
  }
}
.el-menu {
  height: 100%;
  border-right: 0;
}
.menus-collapse {
  color: #fff;
  background-color: #4a5064;
  text-align: center;
  height: 24px;
  letter-spacing: 1px;
}
.el-main {
  background-color: #eaedf1;
}
</style>