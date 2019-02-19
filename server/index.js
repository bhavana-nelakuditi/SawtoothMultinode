const {
  EnclaveFactory
} = require('./enclave')
const {
  SawtoothClientFactory
} = require('./sawtooth-client')
const input = require('./input')

const FAMILY_NAME = 'multinode'
const VERSION = '1.0'
const VALIDATOR = 'http://192.168.99.100:8008'

const createTransactor = (PrivateKey) => {
  const enclave = EnclaveFactory(Buffer.from("288a2021f68a78f4ae41c249a0b5a47a5b3656f88629b326943cfe60b7b0c818", 'hex'))

  const client = SawtoothClientFactory({
    enclave: enclave,
    restApiUrl: VALIDATOR
  })

  return client.newTransactor({
    familyName: FAMILY_NAME,
    familyVersion: VERSION
  })
}
user = 'user1'
async function submit(payload){
resp = await input.submitPayload(payload, createTransactor(null), user)
console.log(resp[1])
}

submit("hello, testing")
