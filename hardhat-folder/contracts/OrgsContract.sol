// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract OrgsContract {

uint256 public totalBalance;

    struct Organization {
        string name;
        string symbol;
        address orgAddress;
        uint256 initialSupply;
        address tokenAddress;
    }

    enum TypeOfStakeholder { community, investors, presale_buyers, founders }

    struct Stakeholder {
        uint256 amount;
        uint256 vestingPeriod_Timelock;
        uint256 releaseTime;
        bool whitelisted;
        TypeOfStakeholder stakeholderType;
    }

    mapping(address => Organization) public organizations;
    mapping(address => Stakeholder) public stakeholders;
    mapping(address => TypeOfStakeholder) public stakeholderTypes;

    event claimedToken(address indexed user, uint256 amount);
    event whitelistedAddress(address indexed user);

    modifier onlyOrg(address orgAddress) {
        require(
            msg.sender == organizations[orgAddress].orgAddress,
            "You are not a registered organization!!!"
        );
        _;
    }

    function registerOrganization(
        string memory name,
        string memory symbol,
        address orgAddress,
        uint256 _initialSupply,
        address tokenAddress
    ) external {
        require(organizations[orgAddress].orgAddress == address(0), "This organization already  exists!!!");

        Organization memory newOrg = Organization({
            name: name,
            symbol: symbol,
            orgAddress: orgAddress,
            initialSupply: _initialSupply,
            tokenAddress: tokenAddress
        });

        organizations[orgAddress] = newOrg;
        totalBalance += _initialSupply;
    }

    function addStakeholder(
        address user,
        uint256 amount,
        uint256 vestingPeriod_Timelock,
        TypeOfStakeholder stakeholderType
    ) external onlyOrg(msg.sender) {
        require(!stakeholders[user].whitelisted, "This stakeholder already exists!!!");
        stakeholders[user] = Stakeholder({
            amount: amount,
            vestingPeriod_Timelock: vestingPeriod_Timelock,
            releaseTime: block.timestamp + vestingPeriod_Timelock,
            whitelisted: false,
            stakeholderType: stakeholderType
        });

        stakeholderTypes[user] = stakeholderType;
    }

    function whitelistAddress(address user) external onlyOrg(msg.sender) {
        require(stakeholders[user].amount > 0, "This stakeholder does not exist!!!");
        require(!stakeholders[user].whitelisted, "This address is already whitelisted!!!");
        stakeholders[user].whitelisted = true;
        emit whitelistedAddress(user);
    }

    function claimTokens() external {
        require(stakeholders[msg.sender].whitelisted, "This address is not whitelisted!!!");
        require(block.timestamp >= stakeholders[msg.sender].releaseTime, "Vesting period (timelock) is still active!!!");

        uint256 amount = stakeholders[msg.sender].amount;
        totalBalance -= amount;
        stakeholders[msg.sender].amount = 0;

        emit claimedToken(msg.sender, amount);
    }
}


