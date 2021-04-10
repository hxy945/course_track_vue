import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Teacher from '../components/teacher/Teacher.vue'
import Student from '../components/student/Student.vue'
import College from '../components/college/College.vue'
import Profession from '../components/college/Profession.vue'
import Class from '../components/class/Class.vue'
import Course from '../components/course/Course.vue'
import Grade from '../components/grade/Grade.vue'
import Analyse from '../components/grade/Analyse.vue'
import Chart from '../components/grade/Chart.vue'
import Distribute from '../components/grade/Distribute.vue'
import StudentLogin from '../components/StudentLogin.vue'
import TeacherLogin from '../components/TeacherLogin.vue'
import StudentAlone from '../components/grade/StudentAlone.vue'
import TeacherAlone from '../components/grade/TeacherAlone.vue'
import TeacherAloneChart from '../components/grade/TeacherAloneChart.vue'

Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/loginStudent',
      component: StudentLogin,
      children: [{
        path: '/studentAlone',
        component: StudentAlone
      }]
    },
    {
      path: '/loginTeacher',
      component: TeacherLogin,
      children: [{
        path: '/teacherAlone',
        component: TeacherAlone
      },{
        path: '/teacherAloneChart',
        component: TeacherAloneChart
      }
      ]
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/teachers',
          component: Teacher
        },
        {
          path: '/students',
          component: Student
        },
        {
          path: '/colleges',
          component: College
        },
        {
          path: '/professions',
          component: Profession
        },
        {
           path: '/classes',
           component: Class
        },
        {
           path: '/courses',
           component: Course
        },
        ,
        {
           path: '/grades',
           component: Grade
        },
        {
          path: '/analysis',
          component: Analyse
        },
        {
          path: '/charts',
          component: Chart
        },
        // {
        //   path: '/distributes',
        //   component: Distribute
        // }
      ]
    },
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  //  next() 直接放行
  //  next('/login') 强制跳转

  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) return next('/login')
  next()
})


export default router
