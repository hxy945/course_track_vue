<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩KPI</el-breadcrumb-item>
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



      <div style="margin-bottom: 20px;">
        <el-table :data="classTableList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="课程名" prop="name"></el-table-column>
          <el-table-column label="最低分" prop="minScore"></el-table-column>
          <el-table-column label="最高分" prop="maxScore"></el-table-column>
          <el-table-column label="平均分" prop="avgScore"></el-table-column>
          <el-table-column label="学生数" prop="countStu"></el-table-column>
          <el-table-column label="0-60人数" prop="notPassNum"></el-table-column>
          <el-table-column label="不及格率" prop="notPassRate"></el-table-column>
          <el-table-column label="60-100人数" prop="passNum"></el-table-column>
          <el-table-column label="及格率" prop="passRate"></el-table-column>
          <el-table-column label="70-80人数" prop="mediumNum"></el-table-column>
          <el-table-column label="良好率" prop="mediumRate"></el-table-column>
          <el-table-column label="80-90人数" prop="fineNum"></el-table-column>
          <el-table-column label="优良率" prop="fineRate"></el-table-column>
          <el-table-column label="90-100人数" prop="excellentNum"></el-table-column>
          <el-table-column label="优秀率" prop="excellentRate"></el-table-column>
        </el-table>

      </div>
      <!-- 按钮区-->
      <div style="text-align:  center;margin-bottom: 20px;">
        <el-button type="text" @click="changeType('pie')">饼图</el-button>
        <el-button type="text" @click="changeType('bar')">柱状图</el-button>
      </div>


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
            selectClassId: "",
            teaId:window.sessionStorage.getItem("id")
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
          //kpi列表数据
          classTableList:[]

        }
      },
      created() {
         this.setCollege()
         this.setProfession()
         this.setClass()
      },
      async mounted() {
        this.getTable()

        this.myChart = echarts.init(document.getElementById('main'));

        const {data : res} = await this.$http.get('gradeKpi/classKpi/pie', {
          params: this.queryInfo
        })
        if(res.meta.status !== 200) {
          return this.$message.error("获取科目KPI数据失败！")
        }
        this.creatPie(res)


      },
      methods: {
        setChart(option){
            this.myChart.clear();
            this.myChart.setOption(option);
        },
        async getCoursePieData(){
           const {data : res} = await this.$http.get('gradeKpi/classKpi/pie', {
             params: this.queryInfo
           })
           if(res.meta.status !== 200) {
             return this.$message.error("获取科目KPI数据失败！")
           }

           if(res.data.length === 0){
             return this.$message.error("该选项下无数据,请重新选择")
           }
           this.creatPie(res)
        },

        async getCourseBarData() {

            const {data : res} = await this.$http.get('gradeKpi/classKpi/bar', {
             params: this.queryInfo
           })
            if(res.meta.status !== 200) {
              return this.$message.error("获取科目KPI数据失败！")
            }
            if(res.data.dataList.length === 0){
              return this.$message.error("该选项下无数据,请重新选择")
            }
             this.creatBar(res)
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

        //创建饼图
        creatPie(res){

          var lefts_title = ['20%','50%','80%']
          var tops_title = ['45%','45%','45%','95%','95%','95%']
          var center_list = [['20%', '30%'],['50%', '30%'],['80%', '30%'],['20%', '80%'],['50%', '80%'],['80%', '80%']]
          var title = [{text: '科目KPI',
                left: 'center',}];
          var labelLine = {
                    length: 15,
                    length2: 0,
                    maxSurfaceAngle: 80
                }
          var series = []
          for(var i=0; i<res.data.length;i++) {
            title.push({
              subtext : res.data[i].courseName,
              left: lefts_title[i],
              top: tops_title[i],
              textAlign: 'center'
            })
            series.push({
                type: 'pie',
                radius: '25%',
                center: center_list[i],
                data: res.data[i].kpi,
                label: {
                    position: 'outer',
                    alignTo: 'labelLine',
                    formatter: '{name|{b}}\n{num|{c} 人}',
                    minMargin: 5,
                    edgeDistance: 10,
                    lineHeight: 15,
                    rich: {
                        num: {
                            fontSize: 10,
                            color: '#999'
                        }
                    }
                },
                labelLine: {
                    length: 15,
                    length2: 0,
                    maxSurfaceAngle: 80
                }
                })
          }
          var optionPie = {
            title: title,
            // title: [{
            //     text: '科目KPI',
            //     left: 'center',
            // }, {
            //     subtext: res.data[0].courseName,
            //     left: '20%',
            //     top: '45%',
            //     textAlign: 'center'
            // }, {
            //     subtext: res.data[1].courseName,
            //     left: '50%',
            //     top: '45%',
            //     textAlign: 'center'
            // }, {
            //     subtext: res.data[2].courseName,
            //     left: '80%',
            //     top: '45%',
            //     textAlign: 'center'
            // },{
            //     subtext: res.data[3].courseName,
            //     left: '20%',
            //     top: '95%',
            //     textAlign: 'center'
            // }, {
            //     subtext: res.data[4].courseName,
            //     left: '50%',
            //     top: '95%',
            //     textAlign: 'center'
            // }, {
            //     subtext: res.data[5].courseName,
            //     left: '80%',
            //     top: '95%',
            //     textAlign: 'center'
            // }],
            toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
            series: series
            // series: [{
            //     type: 'pie',
            //     radius: '25%',
            //     center: ['20%', '30%'],
            //     data: res.data[0].kpi,
            //     label: {
            //         position: 'outer',
            //         alignTo: 'labelLine',
            //         formatter: '{name|{b}}\n{num|{c} 人}',
            //         minMargin: 5,
            //         edgeDistance: 10,
            //         lineHeight: 15,
            //         rich: {
            //             num: {
            //                 fontSize: 10,
            //                 color: '#999'
            //             }
            //         }
            //     },
            //     labelLine: {
            //         length: 15,
            //         length2: 0,
            //         maxSurfaceAngle: 80
            //     }
            // }, {
            //     type: 'pie',
            //     radius: '25%',
            //     center: ['50%', '30%'],
            //     data: res.data[1].kpi,
            //     label: {
            //         position: 'outer',
            //         alignTo: 'labelLine',
            //         formatter: '{name|{b}}\n{num|{c} 人}',
            //         minMargin: 5,
            //         edgeDistance: 10,
            //         lineHeight: 15,
            //         rich: {
            //             num: {
            //                 fontSize: 10,
            //                 color: '#999'
            //             }
            //         }
            //     },
            //     labelLine: {
            //         length: 15,
            //         length2: 0,
            //         maxSurfaceAngle: 80
            //     }
            // }, {
            //     type: 'pie',
            //     radius: '25%',
            //     center: ['80%', '30%'],
            //     data: res.data[2].kpi,
            //     label: {
            //         position: 'outer',
            //         alignTo: 'labelLine',
            //         formatter: '{name|{b}}\n{num|{c} 人}',
            //         minMargin: 5,
            //         edgeDistance: 10,
            //         lineHeight: 15,
            //         rich: {
            //             num: {
            //                 fontSize: 10,
            //                 color: '#999'
            //             }
            //         }
            //     },
            //     labelLine: {
            //         length: 15,
            //         length2: 0,
            //         maxSurfaceAngle: 80
            //     }
            // },{
            //     type: 'pie',
            //     radius: '25%',
            //     center: ['20%', '80%'],
            //     data: res.data[3].kpi,
            //     label: {
            //         position: 'outer',
            //         alignTo: 'labelLine',
            //         formatter: '{name|{b}}\n{num|{c} 人}',
            //         minMargin: 5,
            //         edgeDistance: 10,
            //         lineHeight: 15,
            //         rich: {
            //             num: {
            //                 fontSize: 10,
            //                 color: '#999'
            //             }
            //         }
            //     },
            //     labelLine: {
            //         length: 15,
            //         length2: 0,
            //         maxSurfaceAngle: 80
            //     }
            // },{
            //     type: 'pie',
            //     radius: '25%',
            //     center: ['50%', '80%'],
            //     data: res.data[4].kpi,
            //     label: {
            //         position: 'outer',
            //         alignTo: 'labelLine',
            //         formatter: '{name|{b}}\n{num|{c} 人}',
            //         minMargin: 5,
            //         edgeDistance: 10,
            //         lineHeight: 15,
            //         rich: {
            //             num: {
            //                 fontSize: 10,
            //                 color: '#999'
            //             }
            //         }
            //     },
            //     labelLine: {
            //         length: 15,
            //         length2: 0,
            //         maxSurfaceAngle: 80
            //     }
            // },{
            //     type: 'pie',
            //     radius: '25%',
            //     center: ['80%', '80%'],
            //     data: res.data[5].kpi,
            //     label: {
            //         position: 'outer',
            //         alignTo: 'labelLine',
            //         formatter: '{name|{b}}\n{num|{c} 人}',
            //         minMargin: 5,
            //         edgeDistance: 10,
            //         lineHeight: 15,
            //         rich: {
            //             num: {
            //                 fontSize: 10,
            //                 color: '#999'
            //             }
            //         }
            //     },
            //     labelLine: {
            //         length: 15,
            //         length2: 0,
            //         maxSurfaceAngle: 80
            //     }
            // }
            // ]
          };
          this.setChart(optionPie)
        },
        //创建折线图
        creatBar(res){
          var distributeData =  res.data.dataList
          console.log(distributeData)
          var distributeCol = res.data.xClo
          var yClo = [];
          var seriesData = [];
          for(var i=0;i<distributeData.length;i++){
            yClo.push(distributeData[i].courseName);
            var map = {}
            map["name"] = distributeData[i].courseName
            map["type"] = 'bar'
            map["data"] = distributeData[i].kpi
            seriesData.push(map)
          }
          console.log(seriesData)

          var optionBar =  {
              title: {
                  text: '成绩分布图',
                  //subtext: '数据来自网络'
              },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'shadow'
                  }
              },
              legend: {
                  data: yClo
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: {
                  type: 'value',
                  boundaryGap: [0, 0.01]
              },
              yAxis: {
                  type: 'category',
                  data: distributeCol
              },
              series: seriesData
          }

          this.setChart(optionBar)
        },

        changeCol(selectColId){
          //学院变化时，专业和班级都应该清空
          this.queryInfo.selectProId = ''
          this.queryInfo.selectClassId = ''
          this.setProfession(selectColId)
          this.getTable()
          this.getChartData()
        },
        changePro(selectProId){
          //专业变化时，班级应该清空
          this.queryInfo.selectClassId = ''
          this.setClass(selectProId)
          this.getTable()
          this.getChartData()
        },
        changeClass(){
          //班级变化时
          this.getTable()
          this.getChartData()
        },
        changeType(type){
            this.chartType = type
            this.getChartData()
        },
        getChartData(){
          if(this.chartType === "pie") {
            this.getCoursePieData()
          }
          if(this.chartType === "bar") {
            this.getCourseBarData()
          }
        },


        async getTable(){
           const{data:res} = await this.$http.get('gradeKpi/classKpi',{
             params: this.queryInfo
           })
           if(res.meta.status !== 200) {
             return this.$message.error("获取KPI列表数据失败！")
           }

           this.classTableList = res.data
        },








      }




      }
</script>

<style lang="less" scoped>

</style>
