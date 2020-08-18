class Watcher{

    constructor(vm,key,cb){

        this.vm = vm
        this.key = key

        this.cb =cb

        Dep.target = this

        // 获取data属性的值,即调用Observer的get方法
        this.oldValue = this.vm[key]

        Dep.target = null
    }

    upData(){

        let newValue = this.vm[this.key]

        if(this.oldValue ==newValue){
            return
        }

        this.cb(newValue)
    }
}