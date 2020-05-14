import Web3 from "web3"

const connectWeb3 = function(){

    
    if(typeof window.web3 !== "undefined"){
        const provider = window.web3.currentProvider
        const web3 = new Web3(provider)
        return web3
    }else{
        //alert("请下载metamask之类的以太坊钱包")
        return false
    }
       
 
}

export default connectWeb3()