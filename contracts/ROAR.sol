// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ROAR is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable idrxToken;
    address public treasury;

    enum MatchStatus {
        Open,
        Pending,
        Disputed,
        Resolved
    }

    struct Match {
        string athleteA;
        string athleteB;
        address clubAddress;
        address refereeAddress;
        uint256 totalPool;
        MatchStatus status;
        uint8 winner; // 0 = none, 1 = AthleteA, 2 = AthleteB
        uint256 challengeDeadline; // Timestamp when challenge window ends
        mapping(uint8 => uint256) backingAmount; // side => total amount backed
        mapping(address => mapping(uint8 => uint256)) backerStakes; // backer => side => amount
    }

    mapping(uint256 => Match) public matches;
    uint256 public matchCounter;

    event MatchCreated(uint256 indexed matchId, string athleteA, string athleteB, address club, address referee);
    event AthleteBacked(uint256 indexed matchId, address indexed backer, uint8 side, uint256 amount);
    event ResultSubmitted(uint256 indexed matchId, uint8 winner, uint256 challengeDeadline);
    event FundsDistributed(uint256 indexed matchId, uint8 winner);

    constructor(address _idrxToken, address _treasury) Ownable(msg.sender) {
        idrxToken = IERC20(_idrxToken);
        treasury = _treasury;
    }

    function createMatch(
        string memory _athleteA,
        string memory _athleteB,
        address _clubAddress,
        address _refereeAddress
    ) external onlyOwner returns (uint256) {
        uint256 matchId = matchCounter++;
        Match storage matchData = matches[matchId];
        matchData.athleteA = _athleteA;
        matchData.athleteB = _athleteB;
        matchData.clubAddress = _clubAddress;
        matchData.refereeAddress = _refereeAddress;
        matchData.status = MatchStatus.Open;
        matchData.totalPool = 0;

        emit MatchCreated(matchId, _athleteA, _athleteB, _clubAddress, _refereeAddress);
        return matchId;
    }

    function backAthlete(uint256 matchId, uint8 side, uint256 amount) external {
        require(side == 1 || side == 2, "Invalid side: must be 1 (AthleteA) or 2 (AthleteB)");
        Match storage matchData = matches[matchId];
        require(matchData.status == MatchStatus.Open, "Match is not open for backing");

        idrxToken.safeTransferFrom(msg.sender, address(this), amount);

        matchData.backingAmount[side] += amount;
        matchData.backerStakes[msg.sender][side] += amount;
        matchData.totalPool += amount;

        emit AthleteBacked(matchId, msg.sender, side, amount);
    }

    function submitResult(uint256 matchId, uint8 winner) external {
        Match storage matchData = matches[matchId];
        require(msg.sender == matchData.refereeAddress, "Only assigned referee can submit result");
        require(winner == 1 || winner == 2, "Invalid winner: must be 1 (AthleteA) or 2 (AthleteB)");
        require(matchData.status == MatchStatus.Open || matchData.status == MatchStatus.Pending, "Match status invalid");

        matchData.winner = winner;
        matchData.status = MatchStatus.Pending;
        matchData.challengeDeadline = block.timestamp + 15 minutes;

        emit ResultSubmitted(matchId, winner, matchData.challengeDeadline);
    }

    function distributeFunds(uint256 matchId) external {
        Match storage matchData = matches[matchId];
        require(matchData.status == MatchStatus.Pending, "Match must be in Pending status");
        require(block.timestamp >= matchData.challengeDeadline, "Challenge window still active");
        require(matchData.winner != 0, "No winner set");
        require(matchData.totalPool > 0, "No funds to distribute");

        matchData.status = MatchStatus.Resolved;
        uint256 totalPool = matchData.totalPool;
        uint8 winner = matchData.winner;

        // Calculate distribution amounts
        uint256 toWinningBackers = (totalPool * 60) / 100; // 60%
        uint256 toWinningAthlete = (totalPool * 20) / 100; // 20%
        uint256 toClub = (totalPool * 10) / 100; // 10%
        uint256 toReferee = (totalPool * 5) / 100; // 5%
        uint256 toTreasury = (totalPool * 5) / 100; // 5%

        // Distribute to winning athlete (club address receives it)
        if (toWinningAthlete > 0 && matchData.clubAddress != address(0)) {
            idrxToken.safeTransfer(matchData.clubAddress, toWinningAthlete);
        }

        // Distribute to club
        if (toClub > 0 && matchData.clubAddress != address(0)) {
            idrxToken.safeTransfer(matchData.clubAddress, toClub);
        }

        // Distribute to referee
        if (toReferee > 0 && matchData.refereeAddress != address(0)) {
            idrxToken.safeTransfer(matchData.refereeAddress, toReferee);
        }

        // Distribute to treasury
        if (toTreasury > 0 && treasury != address(0)) {
            idrxToken.safeTransfer(treasury, toTreasury);
        }

        // Distribute to winning backers (proportional)
        if (toWinningBackers > 0 && matchData.backingAmount[winner] > 0) {
            // Note: This is a simplified version. In production, you'd need to track all backers
            // and distribute proportionally. For now, we'll transfer to a pool that can be claimed.
            // A more complete implementation would require iterating through backers or using
            // a withdrawal pattern where backers claim their share.
            
            // For MVP: Store the amount for winning backers to claim
            // In production, implement a claim function for backers
            idrxToken.safeTransfer(treasury, toWinningBackers); // Temporary: send to treasury
            // TODO: Implement proper proportional distribution to winning backers
        }

        emit FundsDistributed(matchId, winner);
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    // Helper function to get match details (excluding mappings)
    function getMatch(uint256 matchId) external view returns (
        string memory athleteA,
        string memory athleteB,
        address clubAddress,
        address refereeAddress,
        uint256 totalPool,
        MatchStatus status,
        uint8 winner,
        uint256 challengeDeadline
    ) {
        Match storage matchData = matches[matchId];
        return (
            matchData.athleteA,
            matchData.athleteB,
            matchData.clubAddress,
            matchData.refereeAddress,
            matchData.totalPool,
            matchData.status,
            matchData.winner,
            matchData.challengeDeadline
        );
    }

    function getBackingAmount(uint256 matchId, uint8 side) external view returns (uint256) {
        return matches[matchId].backingAmount[side];
    }

    function getBackerStake(uint256 matchId, address backer, uint8 side) external view returns (uint256) {
        return matches[matchId].backerStakes[backer][side];
    }
}