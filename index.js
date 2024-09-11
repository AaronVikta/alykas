const fs = require('fs');
const {RuntimeArgs, CLValueBuilder, Contracts, CasperClient, Keys} = require('casper-js-sdk')

const client = new CasperClient("http://95.216.97.163:7777/rpc")
const contract = new Contracts.Contract(client);

const keys = Keys.Ed25519.loadKeyPairFromPrivateFile("./keys/secret_key.pem");

const wasm = new Uint8Array(fs.readFileSync("contract/target/wasm32-unknown-unknown/release/contract.wasm"));

async function install(){
    const args = RuntimeArgs.fromMap({
        "message": CLValueBuilder.string("Hello World")
    })

    const deploy = contract.install(
        wasm,
        args,
        "50000000000",
        keys.publicKey,
        "casper-test",
        [keys]
    )

    try {
       return (await client.putDeploy(deploy))
    } catch (error) 
    {
        return error    
    }
}

// install()
// .then(deployHash =>console.log(deployHash))
// .catch(error=> console.error(error)) 
// // the install function is called once

async function update_msg(){
    contract.setContractHash("hash-09d46bf9c70c9326d8943848c47a2e5035fe6f41b27377e84dd7a6c52c94849c")

    const args = RuntimeArgs.fromMap({
        "message": CLValueBuilder.string("Hello again!"),
    })

    const deploy = contract.callEntrypoint(
        "update_msg",
        args,
        keys.publicKey,
        "casper-test",
        '2000000000',
        [keys]
    )

    try{
        return (await client.putDeploy(deploy))
    }
    catch(error){
        return error
    }
}

// update_msg().then(deployhash => console.log(deployhash))
// .catch(error=> console.error(error))

function queryMessage(){
    contract.setContractHash("hash-09d46bf9c70c9326d8943848c47a2e5035fe6f41b27377e84dd7a6c52c94849c")
    return contract.queryContractData(["message"])
}

queryMessage().then(result =>console.log(result))
.catch(error => console.error(error))