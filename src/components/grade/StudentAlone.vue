<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/studentAlone' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩分析</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区-->
    <el-card class="box-card">

      <!-- 成绩列表区-->
      <el-table :data="studentkpilist" border  stripe   >

        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="学生姓名" prop="name"></el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>

        <el-table-column label="数据结构和算法" prop="class1Score" ></el-table-column>
        <el-table-column label="c++语言" prop="class2Score" ></el-table-column>
        <el-table-column label="操作系统" prop="class3Score" ></el-table-column>
        <el-table-column label="数据库和网络服务" prop="class4Score" ></el-table-column>
        <el-table-column label="计算机网络" prop="class5Score" ></el-table-column>
        <el-table-column label="Java语言" prop="class6Score" ></el-table-column>
        <el-table-column label="最低分" prop="minScore"></el-table-column>
        <el-table-column label="最高分" prop="maxScore"></el-table-column>
        <el-table-column label="平均分" prop="avgScore"></el-table-column>

        <el-table-column  label="均分排名" >
          <el-table-column label="班排名" prop="classAvgScoreRank"></el-table-column>
          <el-table-column label="专业排名" prop="proAvgScoreRank"></el-table-column>
          <el-table-column label="学院排名" prop="colAvgScoreRank"></el-table-column>
        </el-table-column>
        <el-table-column label="总分" prop="sumScore"></el-table-column>
        <el-table-column  label="总分排名" style="text-align: center;">
          <el-table-column label="班排名" prop="classSumScoreRank"></el-table-column>
          <el-table-column label="专业排名" prop="proSumScoreRank"></el-table-column>
          <el-table-column label="学院排名" prop="colSumScoreRank"></el-table-column>
        </el-table-column>

      </el-table>

      <el-table :data="courseRankList" border  stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="课程名" prop="courseName"></el-table-column>
        <el-table-column label="课程分数" prop="score"></el-table-column>
        <el-table-column label="班级排名" prop="classRank"></el-table-column>
        <el-table-column label="专业排名" prop="proRank"></el-table-column>
        <el-table-column label="学院排名" prop="colRank"></el-table-column>
      </el-table>


    </el-card>

  </div>


</template>

<script>
  export default {
    data() {
      return {
        //获取用户列表的参数对象
        queryInfo: {
          number:""

        },
        studentkpilist: [],
         courseRankList:[]

      }
    },
    created() {
      this.getStudentKpiList()
      this.getCourseKpiList()
    },
    methods: {
      async getStudentKpiList() {
        var id = window.sessionStorage.getItem("id")
        const {
          data: res
        } = await this.$http.put('gradeKpi/studentKpiOneOne/'+ id )
        if (res.meta.status !== 200) {
          return this.$message.error("获取学生kpi列表失败！")
        }
        this.getCourseKpiList(res.data.studentKpis[0].id)
        this.studentkpilist = res.data.studentKpis
        //console.log(res)

      },

      async getCourseKpiList(id) {
        const {
          data: resCou,
        } = await this.$http.get('gradeKpi/gradeOneRank/'+ id)
        if (resCou.meta.status !== 200) {
          return this.$message.error('获取学生各科排名失败')
        }
        // this.studentkpilist.forEach((temp, index) => {
        //   // 找到当前点击的行，把动态获取到的数据赋值进去
        //   if (temp.id === row.id) {
            // this.$set(this.$data,"courseRankList",res.data)
          // }
        // });
         this.courseRankList = resCou.data
      }


    }




  }
</script>

<style lang="less" scoped>

</style>
