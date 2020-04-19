/*
    obj: 目标对象
    prop: 需要操作的目标对象的属性名
    descriptor: 描述符
    
    return value 传入对象
*/
// Object.defineProperty(obj, prop, descriptor)

let cb=(key,newValue)=>{
  console.log(`修改了${key}属性：`,newValue)
}
// vue 响应式系统
function defineReactive (obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,       /* 属性可枚举 */
        configurable: true,     /* 属性可被修改或删除 */
        get() {
            return val;         /* 实际上会依赖收集，下一小节会讲 */
        },
        set (newVal) {
            if (newVal === val) return;
            cb(key,newVal);
        }
    });
}
function obsever(obj) {
  // 如果不是对象直接退出
  if(Object.prototype.toString.call(obj)!=='[object Object]'){
    return
  }
  Object.keys(obj).forEach(key=>{
    // 拦截所有属性
    defineReactive(obj,key,obj[key])
    // 递归value.key（如果value是对象也进行object.defineProperties）
    obsever(obj[key])
  })
}
class Vue{
  constructor(options){
    this._data=options.data
    obsever(this._data)
  }
}
let vue=new Vue({
  data:{
    name:1,
    obj:{
      objName:'litianyong02'
    }
  }
})

vue._data.name=1
vue._data.name=2
// 以上是个初始版本的，但有两个问题
new Vue({
  template:
  `<div>{{text1}}<div>
  <div>{{text2}}<div>
  `,
  data:{
    text1:1,
    text2:2,
    text3:3
  }
})
// 如果只是修改text3,那么模板没有用到text3，那就不需要触发cb


// 第二个问题：
// 假设我们现在有一个全局的对象，我们可能会在多个 Vue 对象中用到它进行展示。
let globalObj = {
    text1: 'text1'
};

let o1 = new Vue({
    template:
        `<div>
            <span>{{text1}}</span> 
        <div>`,
    data: globalObj
});

let o2 = new Vue({
    template:
        `<div>
            <span>{{text1}}</span> 
        <div>`,
    data: globalObj
});
//这个时候，我们执行了如下操作。globalObj.text1 = 'hello,text1';我们应该需要通知 o1 以及 o2 两个vm实例进行视图的更新，「依赖收集」会让 text1 这个数据知道“哦～有两个地方依赖我的数据，我变化的时候需要通知它们～”
