class Observer{

    constructor(data){

        this.walk(data)
    }

    walk(data){

        if(!data || typeof data != 'object'){ return }

        // 遍历所有的data属性
        Object.keys(data).forEach(key=>{

            this.defineNative(data,key,data[key])
        })

    }

    defineNative(obj,key,val){

        let _this = this
        // 负责收集依赖，并发送通知
        let dep = new Dep()

        // 如果data[key] 的值是Object
        this.walk(val)

        Object.defineProperty(obj,key,{

            enumerable: true,

            configurable: true,

            get(){
                
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newValue){

                if(newValue == val){ return }

                val = newValue

                _this.walk(val)
                
                // 发送通知
                dep.notify()
            }
        })
    }
}