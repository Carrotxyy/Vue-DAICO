import project from "./project"
import projectList from "./projectList"
import web3 from "./connectWeb3"


const API = {
    utils : {
        contractIsExist : async function(contractAddr){     // 判断当前合约地址是否存在

        }
    },
    loading : async function(){ // 加载所有项目的数据
        // 获取所有项目地址
        const addresses = await projectList.methods.getProjects().call()
        const projects = []

        for (const address of addresses) {
            let instance = await project(address)
            let arr = await instance.methods.getAll().call()
            let p = {
                address     : address,
                owner       : arr[0],
                describe    : arr[1],
                min         : web3.utils.fromWei(arr[2]) ,
                max         : web3.utils.fromWei(arr[3]),
                balance     : web3.utils.fromWei(arr[4]),
                totalInvest : web3.utils.fromWei(arr[5]),
                smybol      : arr[6],
                tokenTotal  : web3.utils.fromWei(arr[7]),
                endTime     : arr[8]
            }
            projects.push(p)
        }
        return projects
    },
    getProject : async function(){      // 已完成投资的项目,进行集资的项目
        const projects = await this.loading()
        const ends = []     // 完成投资的项目
        const runs = []     // 进行投资的项目
        const nowTime = new Date().getTime()
        for (const project of projects) {
            // 因为solidity中时间戳是秒为单位，将秒变成毫秒，如果将js中的毫秒转成秒会损失精度！！
            
            if( parseInt(nowTime) > (parseInt(project.endTime)*1000) ){   
                ends.push(project)
            }else{
                runs.push(project)
            }
        }
        return {ends,runs}
    },
    devProject : async function(address){      // 获取开发者的项目
        
        // 获取所有项目
        const projects = await this.loading()
        const ends = []     // 完成投资的项目
        const runs = []     // 进行投资的项目
        const nowTime = new Date().getTime()
        
        for (const project of projects) {
            if(project.owner === address){
                if( parseInt(nowTime) > (parseInt(project.endTime)*1000) ){   
                    ends.push(project)
                }else{
                    runs.push(project)
                }
            }
        }

        return {ends,runs}

    },
    invest : async function(contract,account,value){           // 进行投资
        const tx = {
            from    : account,
            value   : web3.utils.toWei( value )
        }
        // 获取项目实例
        const instance = await project(contract)
        const message = await instance.methods.invest().send(tx)
        return message
    },
    createProject : async function(obj,account){                // 创建项目
        const tx = {
            from : account
        }
        obj.min = web3.utils.toWei(obj.min)
        obj.max = web3.utils.toWei(obj.max)
        obj.total = web3.utils.toWei(obj.total)
        await projectList.methods.createProject(...Object.values(obj))
                                    .send(tx)
    },
    applyMoney : async function(contractAddr,account,obj){              // 申请资金
        const tx = {
            from : account,
            gas : 2000000
        }
        obj.amount = web3.utils.toWei(obj.amount)
        // 项目实例
        const instance = await project(contractAddr)
        let res = await instance.methods.createPayment(...Object.values(obj))
                                        .send(tx)
        console.log("res",res)
    },
    applyList : async function(contractAddr){       // 获取申请列表
        // 项目实例
        const instance = await project(contractAddr)
        let length = await instance.methods.getPaymentLength().call()
        let applyList = []
        for(let i = 0 ; i < length ; i++){
            let data = await instance.methods.getPayment(0).call()
            // 构建对象
            let payment = {
                index           : i,
                des             : data[0],
                amount          : data[1],
                recevier        : data[2],
                support         : data[3],
                oppose          : data[4],
                isAccomplish    : data[5]
            }
            applyList.push(payment)
        }

        return applyList
        
    },
    investProject : async function(account){               // 投资者投资的项目
        let obj = await this.getProject()   // 获取所有完成、未完成的项目
        let ends = []
        let runs = []

        for (let i = 0 ; i < obj.runs.length ; i++) {
            let runProject = obj.runs[i]
            // 获取对象实例
            let instance = await project(runProject.address)
            // 是否是投资者
            let res = await instance.methods.isInvest(account).call()
            if(res){
                let tokens = await instance.methods.balanceOf(account).call()
                runProject.holdings = web3.utils.fromWei(tokens)
                runs.push(runProject)
            }
        }

        for (let i = 0 ; i < obj.ends.length ; i++) {
            let endProject = obj.ends[i]
            // 获取对象实例
            let instance = await project(endProject.address)
            // 是否持有token
            let num = await instance.methods.balanceOf(account)
            if(num > 0){
                endProject.holdings = web3.utils.fromWei(num)
                ends.push(endProject)
            }
        }

        return {ends,runs}
    },
    investPromoteTap : async function(contractAddr,account){             // 投资者发起提升tap
        // 获取实例
        let instace = await project(contractAddr)
        
        let tx = {
            from : account,
            gas : 5000000
        }
        console.log("instace:",instace)
        // 监听合约内部事件
        instace.events.Stop((err,res)=>{
            if(!err){
                console.log(res)
            }else{
                console.log(err)
            }
            watchEvent.stopWatching()
        })
        // 发起投票
        await instace.methods.promoteTap().send(tx)
        let l = await instace.methods.ivLength().call()
        console.log("length:",l)
        

    },
    devStop : async function(contractAddr,account){                     // 开发者终止合约
        // 获取合约实例
        const instance = await project(contractAddr)
        const tx = {
            from : account
        }
        let message = await instance.methods.stopContract().send(tx)
        console.log("message:",message)
        return true
    }
}


export default API