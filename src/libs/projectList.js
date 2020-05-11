import web3 from "./connectWeb3"
import address from "../build/addresses.json"
import projectList from "../build/ProjectList.json"


const projectListInstance =  new web3.eth.Contract(JSON.parse(projectList.interface),address)
 

export default projectListInstance