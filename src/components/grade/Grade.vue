<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
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
            <el-select v-model="queryInfo.selectClassId" placeholder="筛选班级" @change="getGradeList" clearable>
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col>

        <el-col :span="4">
            <el-select v-model="queryInfo.selectCourseId" placeholder="筛选课程" @change="getGradeList" clearable>
              <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col>

        <el-col :span="4">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGradeList()'>
            <el-button slot="append" icon="el-icon-search" @click="getGradeList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='addGrade'>添加成绩</el-button>
        </el-col>
      </el-row>
      <!-- 成绩列表区-->
      <el-table :data="gradelist" border  :row-class-name="tableRowClassName" @sort-change="sortByScore">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="学生姓名" prop="studentName"></el-table-column>
        <el-table-column label="学号" prop="studentNum"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
        <el-table-column label="课程名" prop="courseName"></el-table-column>
        <el-table-column label="分数" prop="score" sortable="custom" ></el-table-column>
        <el-table-column label="考试时间" prop="testTime"></el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope='scope'>
            <!-- 修改按钮slot-scope='scope'-->
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeGradeById(scope.row.id)">
            </el-button>
          </template>
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

    <!-- 添加成绩的对话框-->
    <el-dialog title="添加成绩" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>
      <!-- 内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="学号" prop="studentNum">
          <el-autocomplete v-model="addForm.studentNum" :fetch-suggestions="queryStuByNum" placeholder="请输入内容"
            :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="学生名" prop="studentName">
          <el-autocomplete v-model="addForm.studentName" :fetch-suggestions="queryStuByName" placeholder="请输入内容"
            :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="addForm.collegeId" placeholder="请选择" @change="setProfession(addForm.collegeId)">
            <el-option v-for="item in collegeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="professionalId">
          <el-select v-model="addForm.professionalId" placeholder="请选择" @change="setClass(addForm.professionalId)">
            <el-option v-for="item in professionalList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级" prop="classId">
          <el-select v-model="addForm.classId" placeholder="请选择">
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="课程" prop="courseId">
          <el-select v-model="addForm.courseId" placeholder="请选择">
            <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试时间">
          <el-date-picker v-model="addForm.testTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input v-model="addForm.score"></el-input>
        </el-form-item>
      </el-form>
      <!--  底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGra">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改成绩" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="学生名">
          <el-input v-model="editForm.studentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="editForm.studentNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程" prop="courseId">
          <el-select v-model="editForm.courseId" placehcolder="请选择">
            <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input v-model="editForm.score"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStuInfo">确 定</el-button>
      </span>
    </el-dialog>

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
        gradelist: [],
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
        // 添加表单的验证规则对象
        addFormRules: {
          studentName: [{
            required: true,
            message: '请输入学生名',
            trigger: 'blur'
          }],
          studentNum: [{
            required: true,
            message: '请输入学号',
            trigger: 'blur'
          }],
          collegeId: [{
            required: true,
            message: '请选择学院',
            trigger: 'blur'
          }],
          professionalId: [{
            required: true,
            message: '请选择专业',
            trigger: 'blur'
          }],
          classId: [{
            required: true,
            message: '请选择班级',
            trigger: 'blur'
          }],
          score: [{
            required: true,
            message: '请添入成绩',
            trigger: 'blur'
          }],
          courseId: [{
            required: true,
            message: '请选择课程',
            trigger: 'blur'
          }]

        },
        //控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //修改表单的验证规则对象
        editFormRules: {
          courseId: [{
            required: true,
            message: '请选择课程',
            trigger: 'blur'
          }],
          score: [{
            required: true,
            message: '请填入成绩',
            trigger: 'blur'
          }]
        },
        //控制分配角色对话框的显示与隐藏
        setRightDialogVisible: false,
        //需要被分配角色的用户信息
        teacherInfo: {},
        //所有角色的数据列表
        rolesList: [],
        //已选中的角色下拉 Id 值
        selectRoleId: '',
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
        selectClassId: ""

      }
    },
    created() {
      this.getGradeList()
      this.getStudentListBynum()
      this.getStudentListByname()
      this.setCollege()
      this.setProfession()
      this.setClass()
      this.setCourse()
    },
    methods: {
      async getGradeList() {
        const {
          data: res
        } = await this.$http.get('grades', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error("获取成绩列表失败！")
        }
        this.gradelist = res.data.grades
        this.total = res.data.total
        //console.log(res)
      },
      //监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getGradeList()
      },
      //监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage

        this.getGradeList()
      },

      // async getGradeListByAscScore() {

      // },
      // async getGradeListByDescScore() {

      // }

      //弹出添加成绩对话框
      addGrade() {
        // this.setCollege()
        // this.setProfession()
        // this.setClass()
        // this.setCourse()
        //展示添加成绩的对话框
        this.addDialogVisible = true;
      },
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
      //监听添加成绩对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮，添加新成绩
      addGra() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          //可以发起添加的网络请求
          const {
            data: res
          } = await this.$http.post('grades', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加成绩失败！')
          }
          this.$message.success('添加成绩成功！')
          //隐藏添加成绩的对话框
          this.addDialogVisible = false
          //重新获取成绩列表数据
          this.getGradeList()
        })
      },
      //展示编辑成绩的对话框
      async showEditDialog(id) {

        this.setCourse()
        // 根据id获取学生内容
        const {
          data: res
        } = await this.$http.get('grades/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('查询成绩信息失败！')
        }
        this.editForm = res.data

        this.editDialogVisible = true;
        //console.log(res.data)
      },
      //监听修改成绩对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //修改成绩信息并提交
      editStuInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          //发起修改成绩信息的数据请求
          const {
            data: res
          } = await this.$http.put('grades/' + this.editForm.id, {
            courseId: this.editForm.courseId,
            score: this.editForm.score
          })
          if (res.meta.status !== 200) {
            return this.$message.error('更新成绩信息失败！')
          }

          //关闭对话框
          this.editDialogVisible = false
          //刷新数据列表
          this.getGradeList()
          //提示修改成功
          this.$message.success('更新成绩信息成功！')

        })
      },
      //根据ID删除对应的成绩信息
      async removeGradeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该成绩, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //如果用户取消删除，则返回值为字符串 cancel
        //如果用户确认删除，则返回值为字符串 confirm
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }

        const {
          data: res
        } = await this.$http.delete('grades/' + id)

        if (res.meta.status !== 200) {
          return this.$message.error('删除成绩失败！')
        }

        this.$message.success('删除成绩成功！')
        this.getGradeList();
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
         this.getGradeList()
      },

      //最上方筛选学院变化后
      changeCol(selectColId) {
        this.setProfession(selectColId)
        this.getGradeList()
      },
      //最上方筛选专业变化后
      changePro(selectProId) {
        this.setClass(selectProId)
        this.getGradeList()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>
