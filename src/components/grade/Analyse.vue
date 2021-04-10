<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩分析</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
            <el-select v-model="queryInfo.selectColId" placeholder="筛选学院"  @change="changeCol(queryInfo.selectColId);" clearable>
              <el-option v-for="item in collegeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col>

        <el-col :span="4">
            <el-select v-model="queryInfo.selectProId" placeholder="筛选专业"  @change="changePro(queryInfo.selectProId);" clearable>
              <el-option v-for="item in professionalList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col>

        <el-col :span="4">
            <el-select v-model="queryInfo.selectClassId" placeholder="筛选班级" @change="getStudentKpiList" clearable>
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col>

        <!-- <el-col :span="4">
            <el-select v-model="queryInfo.selectCourseId" placeholder="筛选课程" @change="getGradeList" clearable>
              <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col> -->

        <el-col :span="4">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGradeList()'>
            <el-button slot="append" icon="el-icon-search" @click="getStudentKpiList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 成绩列表区-->
      <el-table :data="studentkpilist" border  stripe :row-class-name="tableRowClassName" @sort-change="sortByScore" @expand-change="expandChange">
        <el-table-column type="expand" >
          <!-- <template slot-scope="scope"> -->
            <el-table :data="courseRankList" border  stripe>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="课程名" prop="courseName"></el-table-column>
              <el-table-column label="课程分数" prop="score"></el-table-column>
              <el-table-column label="班级排名" prop="classRank"></el-table-column>
              <el-table-column label="专业排名" prop="proRank"></el-table-column>
              <el-table-column label="学院排名" prop="colRank"></el-table-column>
            </el-table>
          <!-- </template> -->

          </el-table-column>




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

      <!-- 分页区域 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>

  </div>


</template>

<script>
  export default {
    data() {
      return {
        //获取用户列表的参数对象
        queryInfo: {
          query: '',
          //当前的页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 10,
          //排序字段
          orderProp: '',
          //排序方法
          order: '',
          //最上方的学院选择框
          selectColId: "",
          //最上方的专业选择框
          selectProId: "",
          //最上方的班级选择框
          selectClassId: "",
          //最上方的班级选择框
          selectCourseId: ""

        },
        studentkpilist: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          studentId: '',
          studentName: '',
          studentNum: '',
          //已选中的学院下拉id值
          collegeId: '',
          //已选中的专业下拉id值
          professionalId: '',
          //已选中的班级下拉id值
          classId: '',
          //成绩
          grade: ''
        },
        //所有学院的数据列表
        collegeList: [],
        //所有专业的数据列表
        professionalList: [],
        //所有班级的数据列表
        classList: [],
        //学生的列表，以number为value
        studentListBynum: [],
        //学生的列表，以name为value
        studentListByname: [],
        //所有的课程
        courseList: [],

        //最上方的学院选择框
        selectColId: "",
        //最上方的专业选择框
        selectProId: "",
        //最上方的班级选择框
        selectClassId: "",
        //课程排名列表
        courseRankList:[]


      }
    },
    created() {
      this.getStudentKpiList()
      // this.getStudentListBynum()
      // this.getStudentListByname()
       this.setCollege()
       this.setProfession()
       this.setClass()
       //this.setCourse()
    },
    methods: {
      async getStudentKpiList() {
        const {
          data: res
        } = await this.$http.get('gradeKpi/studentKpi', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error("获取学生kpi列表失败！")
        }
        this.studentkpilist = res.data.studentKpis
        this.total = res.data.total
        //console.log(res)
      },
      //监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getStudentKpiList()
      },
      //监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage

        this.getStudentKpiList()
      },

      // async getGradeListByAscScore() {

      // },
      // async getGradeListByDescScore() {

      // }

      //设置学院
      async setCollege() {
        //在展示对话框之前，获取所有学院列表
        const {
          data: res
        } = await this.$http.get('colleges')
        if (res.meta.status !== 200) {
          return this.$message.error('获取学院列表失败！')
        }
        //赋值给学院列表
        this.collegeList = res.data;

      },
      //设置专业
      async setProfession(collegeId) {
        //选择学院之后，查询出学院的所有专业
        //console.log("collegeId=" + collegeId)
        const {
          data: res,
        } = await this.$http.get('professions/college', {
          params: {
            collegeId: collegeId
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取专业列表失败')
        }
        //赋值给专业列表
        this.professionalList = res.data;
      },
      //设置班级
      async setClass(professionalId) {
        //选择专业之后，查询出专业的所有班级
        const {
          data: res,
        } = await this.$http.get('classes/profession', {
          params: {
            professionalId: professionalId
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取班级列表失败')
        }
        //赋值给班级列表
        this.classList = res.data;
      },
      //设置课程
      async setCourse() {
        const {
          data: res,
        } = await this.$http.get('courses/all')
        if (res.meta.status !== 200) {
          return this.$message.error('获取课程列表失败')
        }
        //赋值给班级列表
        this.courseList = res.data;
      },


      //获取所有的学生列表 with number
      async getStudentListBynum() {
        const {
          data: res
        } = await this.$http.get('students/all/number', {
          number: this.addForm.number
        })
        if (res.meta.status !== 200) {
          return this.$message.error('查询学生列表失败！')
        }
        this.studentListBynum = res.data;
      },
      //获取所有的学生列表 with name
      async getStudentListByname() {
        const {
          data: res
        } = await this.$http.get('students/all/name', {
          name: this.addForm.name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('查询学生列表失败！')
        }
        this.studentListByname = res.data;
      },
      //number建议框
      queryStuByNum(queryString, cb) {
        if (queryString === "") return
        var studentListBynum = this.studentListBynum;
        var results = queryString ? studentListBynum.filter(this.createFilter(queryString)) : studentListBynum;
        // 调用 callback 返回建议列表的数据

        cb(results)
      },
      //name建议框
      queryStuByName(queryString, cb) {
        if (queryString === "") return
        var studentListByname = this.studentListByname;
        var results = queryString ? studentListByname.filter(this.createFilter(queryString)) : studentListByname;
        cb(results)
      },
      //建议框筛选
      createFilter(queryString) {
        return (studentList) => {
          return (studentList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //建议框被选择后
      async handleSelect(item) {
        //console.log(item);
        const {
          data: res
        } = await this.$http.get("students/number/" + item.number)
        if (res.meta.status !== 200) {
          return this.$message.error('查询学生信息失败！')
        }
        this.addForm.studentId = res.data.id
        this.addForm.studentName = res.data.name
        this.addForm.studentNum = res.data.number
        this.addForm.collegeId = res.data.collegeId
        this.addForm.professionalId = res.data.professionalId
        this.addForm.classId = res.data.classId
      },
      //设置表格的高亮
      tableRowClassName({row, rowIndex}) {
        var score = row.score
        if(score < 60) {
          return 'danger-row';
        }else if(score >= 90 && score <= 100) {
          return 'success-row';
        }
        /* else if(score >= 60 && score < 70) {
          return 'warning-row';
        }else if(score >= 80 && score < 90) {
          return 'primary-row';*/
      },

      //监听表格的排序变化
      async sortByScore({ column, prop, order }) {
        // prop 排序字段
        //order 排序方法 descending 降序  ascending 升序
         this.queryInfo.prop = prop
         this.queryInfo.order = order;
         this.getStudentKpiList()
      },

      //最上方筛选学院变化后
      changeCol(selectColId) {
        this.setProfession(selectColId)
        this.getStudentKpiList()
      },
      //最上方筛选专业变化后
      changePro(selectProId) {
        this.setClass(selectProId)
        this.getStudentKpiList()
      },

      async expandChange(row, expandedRows){
        if(expandedRows.length > 0){
          const {
            data: res,
          } = await this.$http.get('gradeKpi/gradeOneRank/'+ row.id)
          if (res.meta.status !== 200) {
            return this.$message.error('获取学生各科排名失败')
          }
          // this.studentkpilist.forEach((temp, index) => {
          //   // 找到当前点击的行，把动态获取到的数据赋值进去
          //   if (temp.id === row.id) {
              // this.$set(this.$data,"courseRankList",res.data)
            // }
          // });
           this.courseRankList = res.data

        }

      }

    }
  }
</script>

<style lang="less" scoped>

</style>
