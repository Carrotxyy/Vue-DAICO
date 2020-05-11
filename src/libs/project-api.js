import project from "./project"
import projectList from "./projectList"


const API = {
    loading : async function(){ // 加载所有项目的数据
        // 获取所有项目地址
        const addresses = await projectList.methods.getProjects().call()
        const projects = []

        for (const address of addresses) {
            let instance = await project(address)
            let arr = await instance.methods.getAll().call()
            let p = {
                owner : arr[0],
                describe : arr[1],
                min : arr[2],
                max : arr[3],
                balance : arr[4],
                totalInvest : arr[5],
                smybol : arr[6],
                tokenTotal : arr[7],
                endTime : arr[8]
            }
            projects.push(p)
        }
        return projects
    },
    endProject : async function(){
        const projects = await this.loading()
        const ends = []
        const nowTime = new Date().getTime()
        for (const project of projects) {
            console.log("nowTime:",parseInt(nowTime))
            console.log("endTime:",project.endTime)
            if( parseInt(nowTime) > parseInt(project.endTime) ){
                ends.push(project)
            }
        }
        console.log("ends:",ends)
        console.log("projects:",projects)
        return ends
    }
}


export default API