// 实现异步请求
var Util = {
	/***
	 * 获取模板的方法
	 * @id 		模板标签元素id
	 * return 	模板内容
	 **/
	tpl: function (id) {
		return document.getElementById(id).innerHTML;
	},
	/**
	 * 实现异步请求
	 * @url    请求地址
	 * @fn     请求回调函数
	 **/
	 ajax:function(url,fn){
		 // 初始化xhr
		 var xhr = new XMLHttpRequest();
		 // 监听事件
		 xhr.onreadystatechange =function(){
			 // 判断状态
			 if(xhr.readyState ===4){
				 // 判断状态码
				 if(xhr.status === 200){
					 // 执行fn
					 fn && fn(JSON.parse(xhr.responseText))
				 }					 
			 }
		 }
		 xhr.open('GET',url,true);
		 xhr.send(null)
	 }
}
//测试
// Util.ajax('data/home.json',function(res){
// 	console.log(res)
// })

//定义过滤器
Vue.filter('priceFilter',function(price){
	return price+'元'
})
Vue.filter('orignPriceFilter',function(orignPrice){
	return '门市价:'+orignPrice+'元'
})
Vue.filter('salesFilter',function(sales){
	return '销量'+sales
})


// 2.定义组件类
var Home = Vue.extend({
	template:'#tpl_home',
	// 定义同步数据
	data:function(){
		// 返回值是绑定的数据
		return {
			types:[
				{id: 1, url: '01.png', title: '美食'},
				{id: 2, url: '02.png', title: '电影'},
				{id: 3, url: '03.png', title: '酒店'},
				{id: 4, url: '04.png', title: '休闲娱乐'},
				{id: 5, url: '05.png', title: '外卖'},
				{id: 6, url: '06.png', title: 'KTV'},
				{id: 7, url: '07.png', title: '周边游'},
				{id: 8, url: '08.png', title: '丽人'},
				{id: 9, url: '09.png', title: '小吃快餐'},
				{id: 10, url: '10.png', title: '火车票'},
			],
			//定义属性数据，让其具有特性
			ad:[],
			list:[]
		}
	},
	// 请求数据
	created:function(){
		// 作用域是组件实例化对象
		var me = this;
		Util.ajax('data/home.json',function(res){
			// console.log(res,this)//此时this是window
			//请求成功，存储数据
			if(res && res.errno === 0){
				me.ad = res.data.ad;
				me.list = res.data.list
				console.log(me)
			}
		})
	}
	// 定义组件生命周期方法
// 	beforeCreate:function(){
// 		console.log(111,arguments,this)
// 	},
// 	created:function(){
// 		console.log(222,arguments,this,this.types)
// 	},
// 	beforeMount:function(){
// 		console.log(333,arguments,this)
// 	},
// 	mounted:function(){
// 		console.log(444,arguments,this)
// 	},
// 	beforeUpdate:function(){
// 		console.log(555,arguments,this)
// 	},
// 	updated:function(){
// 		console.log(666,arguments,this)
// 	},
// 	beforeDestroy:function(){
// 		console.log(777,arguments,this)
// 	},
// 	destroyed:function(){
// 		console.log(888,arguments,this)
// 	}
})
// 列表页
var List = Vue.extend({
	template: Util.tpl('tpl_list'),
	// 获取属性数据
	props: ['searchquery'],
	data: function () {
		// 返回值才是绑定的数据
		return {
			types: [
				{value: '价格排序', key: 'price'},
				{value: '销量排序', key: 'sales'},
				{value: '好评排序', key: 'evaluate'},
				{value: '优惠排序', key: 'discount'}
			],
			// 定义存储数据的变量
			list: [],
			// 剩余的产品
			others: [],
			// 搜索字段
			query: ''
		}
	},
	// 动态数据
	computed: {
		dealList: function () {
			var me = this;
			return this.list.filter(function (obj) {
				// console.log(arguments)
				return obj.title.indexOf(me.searchquery) >= 0;
			})
		}
	},
	// 定义方法
	methods: {
		// 点击加载更多按钮
		loadMore: function () {
			// 将others中数据传递给list
			this.list = this.list.concat(this.others);
			// 此时others中应该没有数据了
			this.others = [];
		},
		// 点击排序按钮
		sortBy: function (type) {
			// 如果字段是优惠，我们要单独处理
			if (type === 'discount') {
				this.list.sort(function (a, b) {
					// 比较原价-现价的插值
					// 升序
					// return (a.orignPrice - a.price) - (b.orignPrice - b.price)
					// 降序
					return (b.orignPrice - b.price) - (a.orignPrice - a.price)
				})
			} else {
				// 数组排序
				this.list.sort(function (a, b) {
					// 升序
					// return a[type] - b[type]
					// 降序
					return b[type] - a[type]
				})
			}
			// console.log(22, type)
			
		}
	},
	// 组件创建完成要加载数据
	created:function() {
		var me = this;
		// 获取父组件中的数据有两种方式 
		// 1
		// this.query;
		// 2
		// this.$parent.query
		// console.log(this)
		// 获取数据
		Util.ajax('data/list.json?id='+this.query[1],function(res){
			// console.log(res)
			if(res&&res.errno === 0){
				me.list = res.data.slice(0,3)
				me.others = res.data.slice(3)
			}
		})		
	}
})
var Detail = Vue.extend({
	template:'#tpl_detail',
	data:function(){
		return{
			data:{}
		}
	},
	created:function(){
		var me = this;
		Util.ajax('data/product.json?id='+me.$parent.query[0],function(res){
			if(res&&res.errno === 0){
				me.data = res.data;
			}
		})
	}
})
//3.注册组件
Vue.component('home',Home)
Vue.component('list',List)
Vue.component('detail',Detail)

// 创建vue实例化对象
var app = new Vue({
	el:'#app',
	data:{
		// 定义渲染视图的名称
		view:'home',
		// 表示路由参数
		query:[]
	},
	methods:{
		gotoSearch: function (e) {
			// 第一种方式，通过组件间通信
			this.search = e.target.value
			// 第二种方式存储在路由中
			// location.hash = '#/list/search/' + e.target.value
			// console.log(e.target.value)
		},
		goBack: function () {
			history.go(-1)
		}
	}
})

// 定义路由方法
var route = function(){
	// console.log(111)
	// 解析hash,就要获取hash
	var hash = location.hash;
	// #和#/是无意义的，因此要过滤掉
	hash = hash.replace(/#\/?/,'')
	//根据/切割，得到一个数组
	hash = hash.split('/');
	// 第一个模块表示组件的名称，更改view数据
	//不是所有的名称 都能渲染,定义了组件的名称才能渲染
	var map = {
		home:true,
		list:true,
		detail:true
	}
	// 在map表中，存在即可渲染
	if(map[hash[0]]){
		app.view = hash[0]
	}else{
		app.view = 'home'
	}
	// 从第二个成员开始表示路由参数
	app.query = hash.slice(1)
}
// 实现路由
window.addEventListener('hashchange',route)
// 页面加载完成,也需要解析hash,所以要将回调函数提取出来
// window.addEventListener('load',route)
//页面中dom渲染完成,js加载完成就可以执行了
route()