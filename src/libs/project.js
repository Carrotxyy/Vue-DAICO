import web3 from "./connectWeb3"
import project from "../build/Project.json"


// 传入合约地址，获取实例对象
// const getProject = address => new web3.eth.Contract(JSON.parse(project.interface),address)

function getProject (address){
    return new web3.eth.Contract(JSON.parse(project.interface),address)
}
export default getProject