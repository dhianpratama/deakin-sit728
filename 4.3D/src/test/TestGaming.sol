pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Gaming.sol";

contract TestGaming {
    uint public initialBalance = 10 ether;
    Gaming gaming;
    address payable owner; // Declare a variable to hold the owner's address

     // This function runs before all tests and sets up the contract instance
    function beforeAll() public {
        gaming = new Gaming(); // Deploy a new instance of the Gaming contract
        owner = address(uint160(address(this))); // Set the owner to the address of this test contract, ensuring it's payable
    }

    function testPlayerWonGuessLower() public {
        bool expected = true;
        bool result = gaming.determineWinner(3, 4, true);

        Assert.equal(expected, result, "The player should have won by guessing the mystery number was lower than their number");
    }

    function testPlayerWonGuessHigher() public {
        bool expected = true;
        bool result = gaming.determineWinner(7, 6, false);

        Assert.equal(expected, result, "The player should have won by guessing the mystery number was higher than their number");
    }

    function testPlayerLostGuessLower() public {
        bool expected = false;
        bool result = gaming.determineWinner(3, 4, false);

        Assert.equal(expected, result, "The player should have lost by guessing the mystery number was lower than their number");
    }

    function testPlayerLostGuessHigher() public {
        bool expected = false;
        bool result = gaming.determineWinner(7, 6, true);

        Assert.equal(expected, result, "The player should have lost by guessing the mystery number was higher than their number");
    }

   function testWithdrawFunds() public {
        // Fund the game with 10 ether from the owner
        address(gaming).transfer(10 ether); // Send 10 ether from the test contract to the Gaming contract

        // Record initial owner balance before withdrawing funds
        uint256 initialOwnerBalance = owner.balance; // Store the initial balance of the owner (this contract)

        // Call the withdrawFunds function on the Gaming contract
        gaming.withdrawFunds(); // Withdraw the funds from the Gaming contract back to the owner (this contract)

        // Record final owner balance after withdrawing funds
        uint256 finalOwnerBalance = owner.balance; // Store the final balance of the owner after withdrawal

        // Assert that the owner's balance has increased by 10 ether
        Assert.equal(finalOwnerBalance, initialOwnerBalance + 10 ether, "Owner balance should have increased by 10 ether");
    }
    

    // Fallback function to allow this contract to receive ether
    function() external payable {}
}
