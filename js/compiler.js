class Compiler{

    constructor(vm){

        this.el = vm.$el
        this.vm = vm

        this.compile(this.el)
    }

    // 编译模板，处理文本节点和元素节点
    compile(el){

        let childNodes = el.childNodes

        Array.from(childNodes).forEach(node => {
            // 判断当前结点是否是文本节点
            if(this.isTextNode(node)){
                
                // 处理文本节点
                this.compileText(node)
            }
            // 判断当前结点是否是元素节点    
            else if(this.isElementNode(node)){
                
                // 处理元素节点
                this.compileElement(node)
            }

            if(node.childNodes && node.childNodes.length){

                this.compile(node)
            }
        })
    }

    // 编译元素节点，处理指令
    compileElement(node){

        Array.from(node.attributes).forEach(attr => {

            let attrName = attr.name

            if(this.isDirective(attrName)){
                
                // msg
                let key = attr.value
                // text
                attrName = attrName.substr(2)

                this.upData(node,key,attrName)
            }
        })
    }

    upData(node,key,attrName){

        let upDataFn = this[attrName + 'Updata']

        upDataFn.call(this,node,this.vm[key],key)
    }

    // 处理v-text
    textUpdata(node,value,key){

        node.textContent = value

        new Watcher(this.vm, key, (newValue)=>{

            node.textContent = newValue
        })
    }

    // 处理v-modle
    modleUpdata(node,value,key){

        node.value = value

        new Watcher(this.vm, key, (newValue)=>{

            node.value = newValue
        })

        node.addEventListener('input',()=>{

            this.vm[key] = node.value
        })
    }

    // 编译文本节点，处理差值表达式
    compileText(node){

        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)){
            let key = RegExp.$1.trim()

            node.textContent = value.replace(reg, this.vm[key])

            new Watcher(this.vm, key, (newValue)=>{

                node.textContent = newValue
            })
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName){

        return attrName.startsWith('v-')
    }

    // 判断是否是文本节点
    isTextNode(node){

        return node.nodeType === 3
    }

    // 判断是否是元素节点
    isElementNode(node){

        return node.nodeType ===1
    }
}