class Dep{
  constructor(){
    this.a=1
  }
}
Dep.target=2
console.log(Dep,Dep.prototype)
