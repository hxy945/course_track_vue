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
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getStuList()'>
            <el-button slot="append" icon="el-icon-search" @click="getStuList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='setCollege'>添加学生</el-button>
        </el-col>
      </el-row>
      <!-- 学生列表区-->
      <el-table :data="stulist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
        <el-table-column label="专业" prop="professionalName"></el-table-column>
        <el-table-column label="学院" prop="collegeName"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="类型" prop="roleName"></el-table-column>


        <el-table-column label="操作" width="180px">
          <template slot-scope='scope'>
            <!-- 修改按钮slot-scope='scope'-->
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)">
            </el-button>
            <!-- 分配角色按钮 -->
           <!-- <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" size='mini' @click="setRole(scope.row)"></el-button>
            </el-tooltip> -->
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

    <!-- 添加用户的对话框-->
    <el-dialog title="添加学生" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>
      <!-- 内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="学生名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="number">
          <el-input v-model="addForm.number"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="addForm.collegeId" placeholder="请选择"  @change="setProfession(addForm.collegeId)">
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
         <el-select v-model="addForm.classId" placeholder="请选择" >
           <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
           </el-option>
         </el-select>
       </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--  底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStu">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改学生" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="学生名">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="editForm.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="editForm.collegeId" placeholder="请选择" @change="setProfession(editForm.collegeId)">
            <el-option v-for="item in collegeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="professionalId">
          <el-select v-model="editForm.professionalId" placeholder="请选择"  @change="setClass(editForm.professionalId)">
            <el-option v-for="item in professionalList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级" prop="classId">
          <el-select v-model="editForm.classId" placeholder="请选择">
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStuInfo">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 分配角色的对话框-->
    <el-dialog title="分配角色" :visible.sync="setRightDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{teacherInfo.name}}</p>
        <p>当前的角色：{{teacherInfo.roleName}}</p>
        <p>分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
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
        stulist: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          name: '',
          number: '',
          password: '',
          email: '',
          mobile: '',
          //已选中的学院下拉id值
          collegeId: '',
          //已选中的专业下拉id值
          professionalId: '',
          //已选中的班级下拉id值
          classId: '',

        },
        // 添加表单的验证规则对象
        addFormRules: {
          name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名长度在3~10个字符之间',
            trigger: 'blur'
          }],
          number: [{
            required: true,
            message: '请输入学号',
            trigger: 'blur'
          }],
          collegeId:[{
            required: true,
            message: '请选择学院',
            trigger: 'blur'
          }],
          professionalId:[{
            required: true,
            message: '请选择专业',
            trigger: 'blur'
          }],
          classId:[{
            required: true,
            message: '请选择班级',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 15,
            message: '密码长度在6~15个字符之间',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            validator: checkEmail,
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }, {
            validator: checkMobile,
            trigger: 'blur'
          }]
        },
        //控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //修改表单的验证规则对象
        editFormRules: {
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            validator: checkEmail,
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }, {
            validator: checkMobile,
            trigger: 'blur'
          }],
          collegeId:[{
            required: true,
            message: '请选择学院',
            trigger: 'blur'
          }],
          professionalId:[{
            required: true,
            message: '请选择专业',
            trigger: 'blur'
          }],
          classId:[{
            required: true,
            message: '请选择班级',
            trigger: 'blur'
          }],
        },
        //控制分配角色对话框的显示与隐藏
        setRightDialogVisible: false,
        //需要被分配角色的用户信息
        teacherInfo: {},
        //所有角色的数据列表
        rolesList: [],
        //已选中的角色下拉 Id 值
        selectRoleId:'',
        //所有学院的数据列表
        collegeList:[],
        //所有专业的数据列表
        professionalList:[],
        //所有班级的数据列表
        classList:[],
      }
    },
    created() {
      this.getStuList()
    },
    methods: {
      async getStuList() {
        const {
          data: res
        } = await this.$http.get('students', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户列表失败！")
        }
        this.stulist = res.data.students
        this.total = res.data.total
        //console.log(res)
      },
      //监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getStuList()
      },
      //监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getStuList()
      },
      // async userStateChanged(userinfo) {
      //   //console.log(userinfo)
      //   const {
      //     data: res
      //   } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mgStatu}`)
      //   if (res.meta.status !== 200) {
      //     userinfo.mgStatu = !userinfo.mgStatu
      //     return this.$message.error('更新用户状态失败！')
      //   }
      //   this.$message.success('更新用户状态成功！')
      // },

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
          //展示添加学生的对话框
          this.addDialogVisible = true;
      },

      //设置专业
      async setProfession(collegeId) {
        //选择学院之后，查询出学院的所有专业
        console.log("collegeId=" +collegeId )
        const {
          data : res,
        } = await this.$http.get('professions/college', {
          params: {collegeId : collegeId}
        })
        if(res.meta.status !== 200) {
          return this.$message.error('获取专业列表失败')
        }
        //赋值给专业列表
        this.professionalList = res.data;
      },

      //设置班级
      async setClass(professionalId) {
        //选择专业之后，查询出专业的所有班级
        const {
          data : res,
        } = await this.$http.get('classes/profession', {
           params: {professionalId : professionalId}
        })
        if(res.meta.status !== 200) {
          return this.$message.error('获取班级列表失败')
        }
        //赋值给班级列表
        this.classList = res.data;
      },


      //监听添加学生对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮，添加新学生
      addStu() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          //可以发起添加的网络请求
          const {
            data: res
          } = await this.$http.post('students', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加学生失败！')
          }
          this.$message.success('添加学生成功！')
          //隐藏添加学生的对话框
          this.addDialogVisible = false
          //重新获取学生列表数据
          this.getStuList()
        })
      },
      //展示编辑学生的对话框
      async showEditDialog(id) {

        // 根据id获取学生内容
        const {
          data: res
        } = await this.$http.get('students/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('查询学生信息失败！')
        }
        this.editForm = res.data


        //在展示对话框之前，获取所有学院列表
        const {
          data: resCol
        } = await this.$http.get('colleges')
        if (resCol.meta.status !== 200) {
          return this.$message.error('获取学院列表失败！')
        }
        //赋值给学院列表
        this.collegeList = resCol.data;


        const {
          data : resPro,
        } = await this.$http.get('professions/college', {
            params: {collegeId : this.editForm.collegeId}
        })
        if(resPro.meta.status !== 200) {
          return this.$message.error('获取专业列表失败')
        }
        //赋值给专业列表
        this.professionalList = resPro.data;

        const {
          data : resClass,
        } = await this.$http.get('classes/profession', {
           params: {professionalId : this.editForm.professionalId}
        })
        if(resClass.meta.status !== 200) {
          return this.$message.error('获取班级列表失败')
        }
        //赋值给班级列表
        this.classList = resClass.data;

        this.editDialogVisible = true;
        //console.log(res.data)
      },
      //监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editStuInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          //发起修改用户信息的数据请求
          const {
            data: res
          } = await this.$http.put('students/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
            collegeId: this.editForm.collegeId,
            professionalId:this.editForm.professionalId,
            classId:this.editForm.classId,
          })
          if (res.meta.status !== 200) {
            return this.$message.error('更新学生信息失败！')
          }

          //关闭对话框
          this.editDialogVisible = false
          //刷新数据列表
          this.getStuList()
          //提示修改成功
          this.$message.success('更新学生信息成功！')

        })
      },
      //根据ID删除对应的用户信息
      async removeUserById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
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
        } = await this.$http.delete('students/' + id)

        if (res.meta.status !== 200) {
          return this.$message.error('删除学生失败！')
        }

        this.$message.success('删除学生成功！')
        this.getStuList();
      },

      //展示分配角色的对话框
      async setRole(teacherInfo) {
        this.teacherInfo = teacherInfo

        //在展示对话框之前，获取所有角色列表
        const {
          data: res
        } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }

        this.rolesList = res.data

        this.setRightDialogVisible = true
      },

      //点击按钮分配角色
      async saveRoleInfo() {
         if(!this.selectRoleId) {
           return this.$message.error('请选择要分配的角色！')
         }

        const {data:res} = await this.$http.put(`teachers/${this.teacherInfo.id}/role`, {
           rid: this.selectRoleId
         })

        if(res.meta.status !== 200) {
          return this.$message.error('更新角色失败！')
        }

        this.$message.success('更新角色成功！')
        this.getStuList()
        this.setRightDialogVisible = false
      },

      //监听分配角色的对话框的关闭事件
      setRoleDialogClosed() {
        this.selectRoleId = ''
        this.teacherInfo = {}
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
