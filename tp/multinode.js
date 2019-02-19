const {
  TransactionHandler
} = require('sawtooth-sdk/processor/handler')
const crypto = require('crypto')
const {
  InternalError,
  InvalidTransaction
} = require('sawtooth-sdk/processor/exceptions')
const {
  TextEncoder,
  TextDecoder
} = require('text-encoding/lib/encoding')
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')


const _hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const FAMILY_NAME = 'multinode'
const VERSION = '1.0'
const NAMESPACE = _hash(FAMILY_NAME).substr(0, 6)

const _decodeRequest = (payload) =>
  new Promise((resolve, reject) => {
    payload = payload.toString().split(',')
    console.log('PAYLOAD LENGTH ' + payload.length)
    if (payload) {
      resolve({
        name: payload[0],
        message: payload[1]
      })
      return payload
    } else {
      let reason = new InvalidTransaction('Invalid payload serialization')
      reject(reason)
    }
  })

const _toInternalError = (err) => {
  console.log('in error message block')
  let message = err.message ? err.message : err
  throw new InternalError(message)
}
const _setEntry = (context, address, stateValue) => {
  let entries = {
    [address]: encoder.encode(JSON.stringify(stateValue))
  }
  return context.setState(entries)
}

class multinode extends TransactionHandler {
  constructor() {
    super(FAMILY_NAME, [VERSION], NAMESPACE)
    console.log(NAMESPACE + _hash("03fb48da40bf5dabe2b1f71d396dffcac0ec7e1370039a97c2a900cb8c7c2146fd").slice(-64))
  }

  apply(transactionRequest, context) {
    return _decodeRequest(transactionRequest.payload)
      .catch(_toInternalError)
      .then((update) => {
          console.log('Transaction is processing')

          let header = transactionRequest.header
          let userPublicKey = header.signerPublicKey

          if (!update.name) {
            throw new InvalidTransaction('Payload is empty')
          }

          let actionFn = _setEntry
          console.log("USER PUBLIC KEY " + userPublicKey)
          let senderAddress = NAMESPACE + _hash(userPublicKey).slice(-64)
          let getPromise = context.getState([senderAddress])

            let actionPromise = getPromise.then(
              actionFn(context, senderAddress, update)
            )
            return actionPromise.then(addresses => {
              if (addresses.length === 0) {
                throw new InternalError('State Error!')
              }
              console.log(`Certificate is at the address: ${JSON.stringify(addresses)}`)
            })
          })
      }
  }

  module.exports = multinode
