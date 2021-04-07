<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区-->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-cascader
              style="width: 530px;"
              placeholder="请选择学院及专业进行筛选"
              v-model="value"
              :options="colAndProList"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"  clearable></el-cascader>
        </el-col>
        <!-- <el-col :span="4">
            <el-select v-model="selectColId" placeholder="请选择学院"  @change="setSelectProList(selectColId)">
              <el-option v-for="item in selectColList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col>

        <el-col :span="4">
            <el-select v-model="selectProId" placeholder="请选择专业"  @change="getClassByColAndPro(selectProId)">
              <el-option v-for="item in selectProList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col> -->

        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getClassList()'>
            <el-button slot="append" icon="el-icon-search" @click="getClassList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='setCollege'>添加班级</el-button>
        </el-col>
      </el-row>
      <!-- 班级列表区-->
      <el-table :data="classlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="班级名" prop="name"></el-table-column>
        <el-table-column label="班主任" prop="charge"></el-table-column>
        <el-table-column label="所属专业" prop="professionName"></el-table-column>
        <el-table-column label="所属学院" prop="collegeName"></el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope='scope'>
            <!-- 修改按钮slot-scope='scope'-->
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)">
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

    <!-- 添加用户的对话框-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>
      <!-- 内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="班级名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="charge">
          <el-input v-model="addForm.charge"></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="addForm.collegeId" placeholder="请选择" @change="setProfession(addForm.collegeId)">
            <el-option v-for="item in collegeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="professionId">
          <el-select v-model="addForm.professionId" placeholder="请选择">
            <el-option v-for="item in professionalList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--  底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClass">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="班级名">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="charge">
          <el-input v-model="editForm.charge"></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="editForm.collegeId" placeholder="请选择" @change="setProfession(editForm.collegeId)">
            <el-option v-for="item in collegeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="professionId">
          <el-select v-model="editForm.professionId" placeholder="请选择">
            <el-option v-for="item in professionalList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
          pagesize: 10
        },
        classlist: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          name: '',
          charge: '',
          collegeId: '',
          professionId: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          name: [{
            required: true,
            message: '请输入班级名',
            trigger: 'blur'
          }],
          charge: [{
            required: true,
            message: '请输入班主任',
            trigger: 'blur'
          }],
          collegeId: [{
            required: true,
            message: '请选择学院',
            trigger: 'blur'
          }],
          professionId: [{
            required: true,
            message: '请选择专业',
            trigger: 'blur'
          }]
        },
        //控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //修改表单的验证规则对象
        editFormRules: {
          name: [{
            required: true,
            message: '请输入班级名',
            trigger: 'blur'
          }],
          charge: [{
            required: true,
            message: '请输入班主任',
            trigger: 'blur'
          }],
          collegeId: [{
            required: true,
            message: '请选择学院',
            trigger: 'blur'
          }],
          professionId: [{
            required: true,
            message: '请选择专业',
            trigger: 'blur'
          }]
        },
        //控制分配角色对话框的显示与隐藏
        setRightDialogVisible: false,
        //需要被分配角色的用户信息
        userInfo: {},
        collegeList: [],
        professionalList: [],
        //最上方的学院选择框
        selectColId: "",
        //最上方的专业选择框
        selectProId: "",
        selectColList: [],
        selectProList: [],

        colAndProList:[],
        value:'',
        }
      },
      created() {
          this.getClassList()
          this.getColList()
        },
        methods: {
          async getClassList() {
            const {
              data: res
            } = await this.$http.get('classes', {
              params: this.queryInfo
            })
            if (res.meta.status !== 200) {
              return this.$message.error("获取班级列表失败！")
            }
            this.classlist = res.data.classes
            this.total = res.data.total
            //console.log(res)
          },
          //监听 pagesize 改变的事件
          handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getClassList()
          },
          //监听 页码值 改变的事件
          handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getClassList()
          },
          //在弹出添加班级对话框的之前，获取学院的下拉列表
          async setCollege() {
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
            const {
              data: res,
            } = await this.$http.get('professions/college', {
          params: {collegeId : collegeId}
        })
            if (res.meta.status !== 200) {
              return this.$message.error('获取专业列表失败')
            }
            //赋值给专业列表
            this.professionalList = res.data;
          },
          //监听添加班级对话框的关闭事件
          addDialogClosed() {
            this.$refs.addFormRef.resetFields()
          },
          //点击按钮，添加新班级
          addClass() {
            this.$refs.addFormRef.validate(async valid => {
              if (!valid) return
              //可以发起添加班级的网络请求
              const {
                data: res
              } = await this.$http.post('classes', this.addForm)
              if (res.meta.status !== 201) {
                this.$message.error('添加班级失败！')
              }
              this.$message.success('添加班级成功！')
              //隐藏添加用户的对话框
              this.addDialogVisible = false
              //重新获取班级列表数据
              this.getClassList()
            })
          },
          //展示编辑班级的对话框
          async showEditDialog(id) {
            // console.log(id)
            const {
              data: res
            } = await this.$http.get('classes/' + id)
            if (res.meta.status !== 200) {
              return this.$message.error('查询班级信息失败！')
            }
            this.editForm = res.data

            //获取学院下拉框
            const {
              data: resCol
            } = await this.$http.get('colleges')
            if (resCol.meta.status !== 200) {
              return this.$message.error('获取学院列表失败！')
            }
            //赋值给学院列表
            this.collegeList = resCol.data;

            //获取专业下拉框
            const {
              data: resPro,
            } = await this.$http.get('professions/college', {
          params: {collegeId : this.editForm.collegeId}
        })

            if (resPro.meta.status !== 200) {
              return this.$message.error('获取专业列表失败')
            }
            //赋值给专业列表
            this.professionalList = resPro.data;


            this.editDialogVisible = true;
            //console.log(res.data)
          },
          //监听修改班级对话框的关闭事件
          editDialogClosed() {
            this.$refs.editFormRef.resetFields()
          },
          //修改班级信息并提交
          editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
              if (!valid) return
              //发起修改班级信息的数据请求
              const {
                data: res
              } = await this.$http.put('classes/' + this.editForm.id, {
                name: this.editForm.name,
                charge: this.editForm.charge,
                collegeId: this.editForm.collegeId,
                professionId: this.editForm.professionId
              })
              if (res.meta.status !== 200) {
                return this.$message.error('更新班级信息失败！')
              }

              //关闭对话框
              this.editDialogVisible = false
              //刷新数据列表
              this.getClassList()
              //提示修改成功
              this.$message.success('更新班级信息成功！')

            })
          },
          //根据ID删除对应的用户信息
          async removeUserById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
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
            } = await this.$http.delete('classes/' + id)

            if (res.meta.status !== 200) {
              return this.$message.error('删除班级失败！')
            }

            this.$message.success('删除班级成功！')
            this.getClassList();
          },

          async getColList() {
            const {
              data: res
            } = await this.$http.get('colleges/withProByMap')
            if (res.meta.status !== 200) {
              return this.$message.error('获取学院列表失败！')
            }
            //赋值给学院列表
            this.colAndProList = res.data;
          },

          async setSelectProList(collegeId) {
            //选择学院之后，查询出学院的所有专业
            const {
              data : res,
            } = await this.$http.get('professions/college', {
              params: {collegeId : collegeId}
            })
            if (res.meta.status !== 200) {
              return this.$message.error('获取专业列表失败')
            }
            //赋值给专业列表
            this.selectProList = res.data;
          },

          async getClassByColAndPro(professionId) {
            const {
              data: res
            } = await this.$http.get('classes/pageByProId/' + professionId, {
              params: this.queryInfo
            })
            if (res.meta.status !== 200) {
              return this.$message.error("获取班级列表失败！")
            }
            this.classlist = res.data.classes
            this.total = res.data.total
          },

          handleChange() {
             console.log(this.value);
             console.log(this.value.length)
             if(this.value.length === 0) {
               this.getClassList()
               this.getColList()
             }else {
                this.getClassByColAndPro(this.value[1])
             }
          },
        }
    }
</script>

<style lang="less" scoped>

</style>
