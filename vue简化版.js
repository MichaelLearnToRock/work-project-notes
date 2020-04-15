/*
    obj: 目标对象
    prop: 需要操作的目标对象的属性名
    descriptor: 描述符
    
    return value 传入对象
*/
// Object.defineProperty(obj, prop, descriptor)

cd=()=>{}
// vue 响应式系统
function defineReactive(obj,key,value) {
  Object.defineProperties(obj,key,{
    enumerable:true,  /*属性可枚举 */
    configurable:true, /*属性可被修改或者删除*/ 
    get(){
      return val
    },
    set(newValue){
      if(newValue===val) return
      cb(newValue)
    }
  })
}
function obsever(value) {
  // 如果不是对象直接退出
  if(Object.prototype.toString.call(value)==='[object Object]'){
    return
  }
  Object.keys(value).forEach(key=>{
    // 拦截所有属性
    defineReactive(key)
    // 递归value.key（如果value是对象也进行object.defineProperties）
    obsever(value.key)
  })
}
