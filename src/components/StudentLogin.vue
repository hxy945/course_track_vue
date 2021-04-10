<template>

  <el-container class="home-container">
    <!-- 头部区域-->
    <el-header>
      <div>
        <img style="width: 50px;height: 50px;border-radius: 50%;" src="../assets/timg.jpg" alt="" />
        <span>成绩管理系统</span>
      </div>
      <el-button type="infor" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域-->
    <el-container>
      <!-- 侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened
          :collapse="isCollapse"  :collapse-transition = 'false'  router  :default-active='activePath'>
          <!-- 一级菜单-->
          <el-submenu index="1"  key="1">
            <template slot="title"><i class="el-icon-menu"></i>成绩管理</template>
              <el-menu-item-group>
                  <el-menu-item index="/studentAlone">成绩详情</el-menu-item>
              </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体-->
      <el-main>
        <!-- 路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menulist: [],
        iconlist: [
          'el-icon-user',
          'el-icon-guide',
          'el-icon-school',
          // 'el-icon-s-home',
          'el-icon-bell',
          'el-icon-s-custom',
          'el-icon-male',
          'el-icon-date',
          'el-icon-edit-outline',
          'el-icon-pie-chart'
        ],
        //是否折叠
        isCollapse: false,
        //被激活的链接地址
        activePath: '',
      }
    },
    created() {
      this.activePath = window.sessionStorage.getItem("activePath")
    },
    methods: {
      logout() {
        window.sessionStorage.setItem("token","");
        this.$router.push('/login');
      },
      //点击按钮，切换菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      //保存链接的激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    },
}
</script>

<style>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px !important;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .el-header div {
    display: flex;
    align-items: center;
  }

  .el-header div span {
    margin-left: 15px;
  }

  .el-aside {
    background-color: #333744;

  }

  .el-menu {
    border-right: none !important;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
