pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Gaming.sol";

contract TestGaming {
    uint public initialBalance = 10 ether;
    Gaming gaming;

    function beforeAll() public {
        gaming = Gaming(DeployedAddresses.Gaming());
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
}
