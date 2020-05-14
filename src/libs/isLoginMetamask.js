import web3 from "./connectWeb3"


export  default async function(){
    const addresses = await web3.eth.getAccounts()
    if(addresses.length <= 0){
        return false
    }
    return addresses[0]
}