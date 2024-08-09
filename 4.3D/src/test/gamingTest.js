const Gaming = artifacts.require('./Gaming.sol')
const truffleAssert = require('truffle-assertions');

contract('Gaming', async (accounts) => {
  let gaming
  const owner = accounts[5]
  const player1 = accounts[6]

  before(async () => {
    gaming = await Gaming.deployed()
    const fundGame = await gaming.fundGame({from: owner, value: web3.utils.toWei('10', 'ether')})
  })

  it('Should record player losses', async() => {
    const initialBalance = await web3.eth.getBalance(player1)
    const initialBalanceInEther = Number(web3.utils.fromWei(initialBalance, 'ether'))
    const gameRound = await gaming.winOrLose(11, false, {
      from: player1,
      value: web3.utils.toWei('1', 'ether')
    })
    const postBalance = await web3.eth.getBalance(player1)
    const postBalanceInEther = Number(web3.utils.fromWei(postBalance, 'ether'))
    const playerStats = await gaming.players(player1)
    assert.equal(playerStats[1].toNumber(), 1, 'The player should have 1 loss')
    assert.isAtLeast(initialBalanceInEther, postBalanceInEther + 1, 'Player account should have decreased by the amount of the wager')
  })

  it('Should record player wins', async() => {
    const gameRound = await gaming.winOrLose(10, true, {
      from: player1,
      value: web3.utils.toWei('1', 'ether')
    })
    const playerStats = await gaming.players(player1)
    assert.equal(playerStats[0].toNumber(), 1, 'The player should have 1 win')
  })

  it('Should withdraw funds and check owner balance', async () => {
    // Get the initial balance of the owner
    const initialOwnerBalance = await web3.eth.getBalance(owner)
    const initialOwnerBalanceInEther = Number(web3.utils.fromWei(initialOwnerBalance, 'ether'))

    // Withdraw funds
    const withdrawTx = await gaming.withdrawFunds({ from: owner })

    // Get the balance of the owner after withdrawing funds
    const finalOwnerBalance = await web3.eth.getBalance(owner)
    const finalOwnerBalanceInEther = Number(web3.utils.fromWei(finalOwnerBalance, 'ether'))

    // Verify the owner's balance has increased by 10 ether (considering gas costs)
    assert.isAbove(
      finalOwnerBalanceInEther, 
      initialOwnerBalanceInEther + 9.9, 
      'Owner balance should have increased by approximately 10 ether'
    )
  })
})
