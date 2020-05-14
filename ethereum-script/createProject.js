
const Web3 = require("web3")
const path = require("path")


const url = "http://localhost:8546"
const provide = new Web3.providers.HttpProvider(url)
const web3 = new Web3(provide)

const contractPath = path.resolve(__dirname,"../src/build","ProjectList.json")
const {interface} = require(contractPath)
const address = require("../src/build/addresses.json")

async function create(){
    let accounts = await web3.eth.getAccounts()
    let tx = {
        from : "0xCC1794895950a2688679f86FeEf3818e54b728B0",
        gas : 5000000
    }
    
    
    const p = [
        {   
            name:"xyy",
            smybol:"X",
            daysAfter:2,
            tap:web3.utils.toWei('10', 'ether'),
            des: '朱丽叶',
            min: web3.utils.toWei('10', 'ether'),
            max: web3.utils.toWei('20', 'ether'),
            total: web3.utils.toWei('50', 'ether'),
        },
        {   
            name:"好基友",
            smybol:"Y",
            daysAfter:2,
            des: '罗密欧',
            min: web3.utils.toWei('10', 'ether'),
            max: web3.utils.toWei('20', 'ether'),
            total: web3.utils.toWei('50', 'ether'),
        }
        ];
    const instance = await new web3.eth.Contract( JSON.parse(interface) , address)

    // const project = await Promise.all( p.map(item =>  instance.methods.createProject(item.des,item.min,item.max,item.total).send(tx)) )
    for(item of p){
    
        await instance.methods.createProject(item.name,item.smybol,item.daysAfter,item.min,item.max,item.total,item.des).send(tx)
    }
                                          

    const addresses = await instance.methods.getProjects()
                                            .call()
    console.log(addresses)
}



create()