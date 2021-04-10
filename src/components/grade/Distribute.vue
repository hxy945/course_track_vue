<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩分布</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区-->

    <el-card class="box-card">
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
            <el-select v-model="queryInfo.selectClassId" placeholder="筛选班级" @change="changeClass" clearable>
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-col>
      </el-row>

      <div id="main" style="width: 100%;height:760px;">

      </div>

    </el-card>

  </div>
</template>

<script>
    //1.导入echarts
    import * as echarts from 'echarts'

    export default {
      data(){
        return {
          option:'',
          myChart: '',
          queryInfo: {
            //最上方的学院选择框
            selectColId: "",
            //最上方的专业选择框
            selectProId: "",
            //最上方的班级选择框
            selectClassId: ""
          },
          //所有学院的数据列表
          collegeList: [],
          //所有专业的数据列表
          professionalList: [],
          //所有班级的数据列表
          classList: [],
          //最上方的学院选择框
          selectColId: "",
          //最上方的专业选择框
          selectProId: "",
          //最上方的班级选择框
          selectClassId: "",
          chartType:"pie",


        }
      },
      created() {
         this.setCollege()
         this.setProfession()
         this.setClass()
      },
      async mounted() {

        this.myChart = echarts.init(document.getElementById('main'));

        const {data : res} = await this.$http.get('gradeKpi/score', {
          params: this.queryInfo
        })
        if(res.meta.status !== 200) {
          return this.$message.error("获取分数数据失败！")
        }
        this.creatLine(res)
      },
      methods: {
        setChart(option){
            this.myChart.clear();
            this.myChart.setOption(option);
        },

        async getScoreData(){
           const {data : res} = await this.$http.get('gradeKpi/score', {
             params: this.queryInfo
           })
           if(res.meta.status !== 200) {
             return this.$message.error("获取分数数据失败！")
           }

           if(res.data.length === 0){
             return this.$message.error("该选项下无数据,请重新选择")
           }
           this.creatLine(res)
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

        //创建折线图
        creatLine(res){
          var distributeData =  res.data.dataList
          console.log(distributeData)
          var ids = res.data.ids
          var legend = res.data.xClo
          var yClo = [];
          var seriesData = [];
          for(var i in distributeData){
            var map = {}
            map["name"] = legend[i]
            map["type"] = 'line'
            map["stack"] = '总量'
            map["data"] = distributeData[i]
            map["smooth"] = true
            seriesData.push(map)
          }

          console.log(seriesData);

          var optionLine =  {
              title: {
                  text: '成绩分布图'
              },
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data: legend
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              toolbox: {
                  feature: {
                      saveAsImage: {}
                  }
              },
              xAxis: {
                  type: 'value'
              },
              yAxis: {
                  type: 'value'
              },
              series: seriesData
          };

          this.setChart(optionLine)
        },

        changeCol(selectColId){
          //学院变化时，专业和班级都应该清空
          this.queryInfo.selectProId = ''
          this.queryInfo.selectClassId = ''
          this.setProfession(selectColId)
          this.getScoreData()
        },
        changePro(selectProId){
          //专业变化时，班级应该清空
          this.queryInfo.selectClassId = ''
          this.setClass(selectProId)
          this.getScoreData()
        },
        changeClass(){
          this.getScoreData()
        },


      }




      }
</script>

<style lang="less" scoped>

</style>
