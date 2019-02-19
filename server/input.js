const fs = require('fs')
const path = require('path')

const input = {
  submitPayload: async (payload, transactor, user) => {
    const txn = payload
    var user1 = user
    try {
      console.log(`Submitting transaction to Sawtooth REST API`)
      const txnRes = await transactor.post(txn)
      if (!txnRes) {
        console.log('No Response')
      } else if (!txnRes[1]) {
        console.log('No transaction id')
      }
      // Log only a few key items from the response, because it's a lot of info
      console.log({
        status: txnRes[0].status,
        statusText: txnRes[0].statusText
      })
      return txnRes
    } catch (err) {
      console.log('Error submitting transaction to Sawtooth REST API: ', err)
      console.log('Transaction: ', txn)
    }
  }
}
module.exports = input
