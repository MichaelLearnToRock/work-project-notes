// 简单的订阅 发布者模式
class Event{
  constructor(){
    this.draft={}
    // 数据类型
    // draft=[{'key':function(){}}]
  }
  // 存事件
  add(key,func){
    if(this.draft[key]){
      this.draft[key].push(func)
    }else{
      this.draft[key]=[func]
    }
  }
  // 触发事件
  fire(key,...arguements){
    if(this.draft[key]){
      this.draft[key].forEach(func=>{
        func(...arguements)
      })
    }
  }
  remove(key){
    if(this.draft[key]){
      delete this.draft[key]
    }
  }
}
// 事件寄存器
const event=new Event()
event.add('八点了',function(){
  console.log('要起床了')
})

event.fire('八点了')
