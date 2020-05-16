const Web3 = require("web3")
const fs = require("fs-extra")
const path = require("path")


const httpProvider = new Web3.providers.HttpProvider("http://localhost:8546")



const web3 = new Web3(httpProvider)

const contractPath = path.resolve(__dirname,"../src/build/","ProjectList.json")
// 获取接口、bytecode
const {interface,bytecode} = require(contractPath)

async function deployContract(){

    // 获取用户列表
    // const account = await web3.eth.getAccounts()
    // 构造交易对象
    const tx = {from : "0x7b81126bA7F56b098B13620b389c2335bEB58660",gas:5000000}
    // 部署合约
    const instance = await new web3.eth.Contract( JSON.parse(interface) )
                                    .deploy({data:"0x" + bytecode})
                                    .send(tx)

    console.log("合约地址:",instance._address)
    // 将合约地址保存到文件中
    fs.writeFileSync(path.resolve(__dirname,"../src/build/","addresses.json"), JSON.stringify(instance._address) )


}

deployContract()