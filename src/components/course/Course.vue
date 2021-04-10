<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getCourseList()'>
            <el-button slot="append" icon="el-icon-search" @click="getCourseList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='setTeaList'>添加课程</el-button>
        </el-col>
      </el-row>
      <!-- 课程列表区-->
      <el-table :data="courselist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="课程名" prop="name"></el-table-column>
        <el-table-column label="授课老师" prop="teaName"></el-table-column>
        <el-table-column label="老师电话" prop="mobile"></el-table-column>
        <el-table-column label="老师邮箱" prop="email"></el-table-column>
        <el-table-column label="开课时间" prop="beginTime"></el-table-column>
        <el-table-column label="课程描述" prop="description"></el-table-column>
        <el-table-column label="开课状态" prop="isBegin">
          <template slot-scope='scope'>
            <el-switch v-model="scope.row.isBegin" @change="courseStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope='scope'>
            <!-- 修改按钮slot-scope='scope'-->
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeCourseById(scope.row.id)">
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

    <!-- 添加课程的对话框-->
    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>
      <!-- 内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="课程名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
       <el-form-item label="授课老师" prop="teaId">
         <el-select v-model="addForm.teaId" placeholder="请选择老师" >
           <el-option v-for="item in teaList" :key="item.id" :label="item.name" :value="item.id">
           </el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="开课日期" prop="beginTime">
         <el-date-picker
               v-model="addForm.beginTime"
               type="date"
               placeholder="选择日期">
         </el-date-picker>
       </el-form-item>
        <el-form-item label="课程描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入描述内容"
            v-model="addForm.description">
          </el-input>
        </el-form-item>
      </el-form>
      <!--  底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改课程的对话框 -->
    <el-dialog title="修改课程" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="课程名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="授课老师" prop="teaId">
          <el-select v-model="editForm.teaId" placeholder="请选择老师" >
            <el-option v-for="item in teaList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开课日期" prop="beginTime">
          <el-date-picker
                v-model="editForm.beginTime"
                type="date"
                placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="课程描述">
           <el-input
             type="textarea"
             :rows="2"
             placeholder="请输入描述内容"
             v-model="editForm.description">
           </el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourseInfo">确 定</el-button>
      </span>
    </el-dialog>


    

  </div>


</template>

<script>
  export default {
    data() {
      //验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        //验证邮箱的正则表达式
        const regEmail = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        if (regEmail.test(value)) {
          return cb()
        }
        cb(new Error("请输入合法的邮箱"))
      }
      //验证手机号的规则
      var checkMobile = (rule, value, cb) => {
        //验证手机的正则表达式
        const regMobile = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
        if (regMobile.test(value)) {
          return cb()
        }
        cb(new Error("请输入正确的手机号"))
      }
      return {
        //获取用户列表的参数对象
        queryInfo: {
          query: '',
          //当前的页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 10
        },
        courselist: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          name: '',
          teaId: '',
          beginTime: '',
          description:''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          name: [{
            required: true,
            message: '请输入课程名',
            trigger: 'blur'
          }],
          teaId: [{
            required: true,
            message: '请选择老师',
            trigger: 'blur'
          }],
          beginTime: [{
            required: true,
            message: '请选择开课时间',
            trigger: 'blur'
          }],
        },
        //控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //修改表单的验证规则对象
        editFormRules: {
          name: [{
            required: true,
            message: '请输入课程名',
            trigger: 'blur'
          }],
          teaId: [{
            required: true,
            message: '请选择老师',
            trigger: 'blur'
          }],
          beginTime: [{
            required: true,
            message: '请选择开课时间',
            trigger: 'blur'
          }],
        },
        //控制分配角色对话框的显示与隐藏
        setRightDialogVisible: false,
        //需要被分配角色的用户信息
        userInfo: {},
        //所有角色的数据列表
        rolesList: [],
        //已选中的下拉 Id 值
        selectRoleId:'',
        //获取教师列表
        teaList:[],
      }
    },
    created() {
      this.getCourseList()
    },
    methods: {
      async getCourseList() {
        const {
          data: res
        } = await this.$http.get('courses', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error("获取课程列表失败！")
        }
        this.courselist = res.data.courses
        this.total = res.data.total
        //console.log(res)
      },
      //监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getCourseList()
      },
      //监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getCourseList()
      },
      async courseStateChanged(courseinfo) {
        //console.log(userinfo)
        const {
          data: res
        } = await this.$http.put(`courses/${courseinfo.id}/state/${courseinfo.isBegin}`)
        if (res.meta.status !== 200) {
          courseinfo.isBegin = !courseinfo.isBegin
          return this.$message.error('更新开课状态失败！')
        }
        this.$message.success('更新开课状态成功！')
      },
      //监听添加课程对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //在弹出添加课程对话框之前先获取老师列表
      async setTeaList() {
        const {
          data: res
        } = await this.$http.get('teachers/list')
        if (res.meta.status !== 200) {
          return this.$message.error('获取教师列表失败！')
        }
        //赋值给教师列表
        this.teaList = res.data;
        //展示添加课程的对话框
        this.addDialogVisible = true;
      },


      //点击按钮，添加新课程
      addCourse() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          //可以发起添加课程的网络请求
          const {
            data: res
          } = await this.$http.post('courses', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加课程失败！')
          }
          this.$message.success('添加课程成功！')
          //隐藏添加课程的对话框
          this.addDialogVisible = false
          //重新获取课程列表数据
          this.getCourseList()
        })
      },
      //展示编辑课程的对话框
      async showEditDialog(id) {
        // console.log(id)
        const {
          data: res
        } = await this.$http.get('courses/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('查询课程信息失败！')
        }
        this.editForm = res.data

        const {
          data: resTea
        } = await this.$http.get('teachers/list')
        if (resTea.meta.status !== 200) {
          return this.$message.error('获取教师列表失败！')
        }
        //赋值给教师列表
        this.teaList = resTea.data;

        this.editDialogVisible = true;
        //console.log(res.data)
      },
      //监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editCourseInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          //发起修改用户信息的数据请求
          const {
            data: res
          } = await this.$http.put('courses/' + this.editForm.id, {
            name: this.editForm.name,
            teaId: this.editForm.teaId,
            beginTime:this.editForm.beginTime,
            description: this.editForm.description
          })
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户信息失败！')
          }

          //关闭对话框
          this.editDialogVisible = false
          //刷新数据列表
          this.getCourseList()
          //提示修改成功
          this.$message.success('更新用户信息成功！')

        })
      },
      //根据ID删除对应的用户信息
      async removeCourseById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
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
        } = await this.$http.delete('courses/' + id)

        if (res.meta.status !== 200) {
          return this.$message.error('删除课程失败！')
        }

        this.$message.success('删除课程成功！')
        this.getCourseList();
      },

      

    }

  }
</script>

<style lang="less" scoped>

</style>
