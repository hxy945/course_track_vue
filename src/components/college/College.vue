<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学院管理</el-breadcrumb-item>
      <el-breadcrumb-item>学院列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList()'>
            <el-button slot="append" icon="el-icon-search" @click="getColList()"></el-button>
          </el-input>
        </el-col>
      </el-row> -->
      <!-- 学院列表区-->
      <el-table :data="collegelist" border stripe>
        <!-- 展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.professionList" >
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="具有专业" prop="name"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="学院名" prop="name"></el-table-column>
        <el-table-column label="院长" prop="charge"></el-table-column>
      </el-table>
    </el-card>

  </div>


</template>

<script>
  export default {
    data() {
      return {
        //获取学院列表的参数对象
        queryInfo: {
          query: '',
        },
        collegelist: [],
        total: 0,

        userInfo: {},
        //所有角色的数据列表
        collegesList: [],
      }
    },
    created() {
      this.getColList()
    },
    methods: {
      async getColList() {
        const {
          data: res
        } = await this.$http.get('colleges/withPro', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error("获取学院列表失败！")
        }
        this.collegelist = res.data
        this.total = res.data.total
        //console.log(res)
      },

      //当展开列被点击时
      setProList() {
        console.log("111")
      }

    }

  }
</script>

<style lang="less" scoped>

</style>
