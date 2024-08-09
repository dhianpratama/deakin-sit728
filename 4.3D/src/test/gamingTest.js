const Gaming = artifacts.require('./Gaming.sol'); // Import the Gaming contract's compiled artifact

contract('Gaming', async (accounts) => { // Define a test suite for the Gaming contract, using the provided accounts
  let gaming; // Variable to hold the deployed instance of the Gaming contract
  const owner = accounts[5]; // Assign the account as the owner
  const player1 = accounts[6]; // Assign the account as player1

  before(async () => { // A setup block that runs before the tests start
    gaming = await Gaming.deployed(); // Deploy the Gaming contract and store the instance in the gaming variable
    await gaming.fundGame({from: owner, value: web3.utils.toWei('10', 'ether')}); // Fund the contract with 10 ether from the owner account
  });

  it('Should record player losses', async () => { // Test case to verify recording player losses
    const initialBalance = await web3.eth.getBalance(player1); // Fetch player1's balance before the game
    const initialBalanceInEther = Number(web3.utils.fromWei(initialBalance, 'ether')); // Convert the balance from Wei to Ether for easier comparison

    // Player1 plays and loses, sending 1 ether to the contract
    await gaming.winOrLose(10, false, {
      from: player1,
      value: web3.utils.toWei('1', 'ether')
    });

    const postBalance = await web3.eth.getBalance(player1); // Fetch player1's balance after the game
    const postBalanceInEther = Number(web3.utils.fromWei(postBalance, 'ether')); // Convert the balance from Wei to Ether for easier comparison
    const playerStats = await gaming.players(player1); // Fetch player1's game statistics from the contract

    // Check that player1 now has 1 recorded loss
    assert.equal(playerStats[1].toNumber(), 1, 'The player should have 1 loss');
    
    // Ensure that player1's balance has decreased by approximately 1 ether
    assert.isAtLeast(initialBalanceInEther, postBalanceInEther + 1, 'Player account should have decreased by the amount of the wager');
  });

  it('Should record player wins', async () => { // Test case to verify recording player wins
    // Player1 plays and wins, sending 1 ether to the contract
    await gaming.winOrLose(10, true, {
      from: player1,
      value: web3.utils.toWei('1', 'ether')
    });

    const playerStats = await gaming.players(player1); // Fetch player1's game statistics from the contract

    // Check that player1 now has 1 recorded win
    assert.equal(playerStats[0].toNumber(), 1, 'The player should have 1 win');
  });

  it('Should withdraw funds and check owner balance', async () => { // Test case to verify the withdrawFunds function
    // Get the initial balance of the owner before withdrawing funds
    const initialOwnerBalance = await web3.eth.getBalance(owner);
    const initialOwnerBalanceInEther = Number(web3.utils.fromWei(initialOwnerBalance, 'ether')); // Convert the balance from Wei to Ether

    // Call the withdrawFunds function from the owner account
    await gaming.withdrawFunds({ from: owner });

    // Get the balance of the owner after withdrawing funds
    const finalOwnerBalance = await web3.eth.getBalance(owner);
    const finalOwnerBalanceInEther = Number(web3.utils.fromWei(finalOwnerBalance, 'ether')); // Convert the balance from Wei to Ether

    // Verify the owner's balance has increased by approximately 10 ether (considering gas costs)
    assert.isAbove(finalOwnerBalanceInEther, initialOwnerBalanceInEther + 9.9, 'Owner balance should have increased by approximately 10 ether');
  });
});
