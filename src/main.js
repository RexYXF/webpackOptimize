// import vue from 'vue' //runtime-only的vue包
// import Vue from 'vue/dist/vue' //完整版的vuejs
// import VueRouter from 'vue-router'

// Vue.use(VueRouter)

// const homeComponent = {
//   template: '<h2>我是home页面</h2>'
// }

// const newsComponent = {
//   template: '<h2>我是news页面</h2>'
// }

// const router = new VueRouter({
//   routes: [
//     {
//       path: '/home',
//       component: homeComponent
//     },
//     {
//       path: '/news',
//       component: newsComponent
//     }
//   ]
// })

// new Vue({
//   el: '#app',
//   data: {
//     msg: 'hellowould'
//   },
//   router
// })



// import moment from 'moment'
// //手动引入语言包
// import 'moment/locale/zh-cn'
// //设置语言
// moment.locale('zh-CN')
// console.log(moment().subtract(6, 'days').calendar()); 


// import $ from 'jquery'
// let a = 1
// if(a=1){
//   import('jquery').then(({ default:$ })=>{
//     //执行resolve时就表示jQuery导入完成了
//     $(function(){
//       $('<div></div>').html('我是main').appendTo('body')
//     })
//   })
// }

// function getComponent(){
//   return import('jquery').then(({ default : $ }) => {
//     //执行resolve时就表示jQuery导入完成了
//     return $('<div></div>').html('我是main')
//   })
// }

// getComponent().then(item => {
//   item.appendTo('body')
// })


//需求: 当用户点击按钮时,添加一个div(懒加载jq)
window.onload = function() {
  document.getElementById('btn').onclick = function() {
    getComponent().then((item) => {
      item.appendTo('body')
    })
  }
}

function getComponent() {
  //动态导入
  // /* webpackPrefetch:true */ Prefetch魔法注释
  return import(/* webpackPrefetch:true */ 'jquery').then(({ default: $ }) => {
    return $('<div></div>').html('我是main')
  })
}



