
const Web3 = require("web3")
const path = require("path")


const url = "http://localhost:8546"
const provide = new Web3.providers.HttpProvider(url)
const web3 = new Web3(provide)

const contractPath = path.resolve(__dirname,"../src/build","Project.json")
const {interface} = require(contractPath)

async function d(){
    let instance = await new web3.eth.Contract(JSON.parse(interface),"0xE5AE8bcF2244d52e2fB3D6120bffe5C5D6aDa3e0")
    let res = await instance.methods.createPayment("dd",web3.utils.toWei("1"),"0xBBe93031f94D6a766624fAF89eC8e46a7A4d1e50").call({from:"0x7b81126bA7F56b098B13620b389c2335bEB58660"})
    let data = await instance.methods.getPaymentLength().call()
    console.log(res,data)
}
d()