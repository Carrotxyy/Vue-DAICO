import project from "./project"
import projectList from "./projectList"
import web3 from "./connectWeb3"


const API = {
    currentAccount : async function(){

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
    }
}


export default API