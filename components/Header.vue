<template>
  <el-menu
    :default-active="curSelectedIndex"
    :router="true"
    class="menu"
    mode="horizontal"
    background-color="rgb(64, 158, 255)"
    text-color="#FFFFFF"
    active-text-color="#FFFFFF"
  >
    <el-submenu index="2">
      <!-- <template slot="title">
        <img src="/logo.png" class="avatar" />
      </template>-->
      <el-menu-item>
        <span>{{ }}</span>
      </el-menu-item>
      <el-menu-item index="2-1">退出登录</el-menu-item>
    </el-submenu>
    <el-menu-item v-for="(menu,index) in menus" :key="index" :index="menu.path">{{ menu.name }}</el-menu-item>
  </el-menu>
</template>
<script>
export default {
  computed: {
    curSelectedIndex() {
      return this.$route.path;
    },
    menus() {
      return [
        {
          name: "服务器状态",
          path: "/machines"
        },
        {
          name: "微服务状态",
          path: "/services"
        },
        {
          name: "添加服务器",
          path: "/addmachine"
        },
        {
          name: "添加微服务",
          path: "/addservice"
        },
        {
          name: "添加自定义指标",
          path: "/addindex"
        }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
.menu {
  padding: 0 20px;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background: #d8d8d8;
  }
  .logo {
    height: 40px;
    width: auto;
    //margin-left: -20px;
  }
}
</style>
