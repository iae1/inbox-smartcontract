// contract test code will go here
const assert = require('assert-plus')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const {interface, bytecode} = require('../compile')

let accounts
let inbox
const INITIAL_MESSAGE = 'Hi there!'

beforeEach(async () => {

  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  // Use one of those accts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // teaches web3 about what methods an inbox contract has
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE]}) // Tells web3 that we want to deploy a new copy of this contract
    .send({ from: accounts[0], gas: '1000000'}) // Instructs web3 to send out a transaction that creates this contract
})

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address)
  })
  it ('has a default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, INITIAL_MESSAGE)
  })

  it('can change the message', async () => {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    assert.equal(message, 'bye')
  })
})
