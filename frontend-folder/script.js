import {ethers, providers} from "./ethers-5.7.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectBtn = document.getElementById("connectBtn");
connectBtn.onclick = connectWallet;
const registerOrganizationBtn = document.getElementById("registerOrganizationBtn");
registerOrganizationBtn.onclick = registerOrganization;
const addStakeholderBtn = document.getElementById("addStakeholderBtn");
addStakeholderBtn.onclick = addStakeholder;
const whitelistAddressBtn = document.getElementById("whitelistAddressBtn");
whitelistAddressBtn.onclick = whitelistAddress;
const claimTokensBtn = document.getElementById("claimTokensBtn");
claimTokensBtn.onclick = claimTokens;
const readTotalBalanceBtn = document.getElementById("readTotalBalanceBtn");
readTotalBalanceBtn.onclick = totalBalance;
const readTimeBtn = document.getElementById("readTimeBtn");
readTimeBtn.onclick = time;
const stakeHoldersBtn = document.getElementById("stakeHoldersBtn");
stakeHoldersBtn.onclick = stakeholders;
const organizationsBtn = document.getElementById("organizationsBtn");
organizationsBtn.onclick = organizations;


console.log("Welcome to my vesting DApp!!!");
  
  async function connectWallet() {
    if (typeof window.ethereum != undefined ) {
      console.log("I see a MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected account:", address);
      document.getElementById("accountAddress").textContent =
      "Connected Account: " + address;

      await window.ethereum.request({method: "eth_requestAccounts"});
      connectBtn.innerHTML="Wallet Connected"
      console.log("Wallet Connected Successfully!!!");
      console.log("\n");
    } else {
      connectBtn.innerHTML="Please install MetaMask"
      console.log("No MetaMask!");}
  }

  async function registerOrganization() {
    const name = document.getElementById("name").value;
    const symbol = document.getElementById("symbol").value;
    const orgAddress = document.getElementById("orgAddress").value;
    const _initialSupply = document.getElementById("_initialSupply").value;
    const tokenAddress = document.getElementById("tokenAddress").value;
    console.log("Registering your organization on the blockchain...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.registerOrganization(
          name, symbol, orgAddress, _initialSupply, tokenAddress);
        console.log("Processing...");
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Successfully registered an organization!!!");
        console.log("\n");
      } catch (error) {
        console.log(error);
      }
  } 

  }

  async function addStakeholder() {
    const user = document.getElementById("user").value;
    const amount = document.getElementById("amount").value;
    const vestingPeriod_Timelock = document.getElementById("vestingPeriod_Timelock").value;
    const stakeholderType = document.getElementById("stakeholderType").value;
    console.log("Adding a stakeholder to the blockchain...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.addStakeholder(
          user, amount, vestingPeriod_Timelock, stakeholderType);
        console.log("Processing...");
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Successfully added a stakeholder!!!");
        console.log("\n");
      } catch (error) {
        console.log(error);
      }
  }
  
  }

  async function whitelistAddress() {
    const userAddress = document.getElementById("userAddress").value;
    console.log("Whitelisting a stakeholder...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.whitelistAddress(userAddress);
        console.log("Processing...");
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Successfully whitelisted a stakeholder!!!");
        console.log("\n");
      } catch (error) {
        console.log(error);
      }
  }
  
}

  async function claimTokens() {
    console.log("Withdrawing tokens...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.claimTokens();
        console.log("Processing...");
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Successfully withdrawn tokens!!!");
        console.log("\n");
      } catch (error) {
        console.log(error);
      }
  } 

}

async function totalBalance() {
  console.log("Fetching the total available balance!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  
    const retrievedtotalBalance = await contract.totalBalance();
    console.log(`Available balance: ${retrievedtotalBalance}\n`);
    document.getElementById("readBalanceOutput").innerHTML =
    "Available balance : " + retrievedtotalBalance + " Tokens";
    console.log("\n");
}

async function time() {
  console.log("Fetching the current time of the blockchain!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  
    const retrievedTime = await contract.time();
    console.log(`Block.timestamp: ${retrievedTime}`);
    document.getElementById("readTimeOutput").innerHTML =
    "Block.timestamp is : " + retrievedTime;
    console.log("\n");
}

async function organizations() {
  const organizationsAddress = document.getElementById("organizationsAddress").value;
  console.log("Fetching the details of this organization!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  
    const organizationsDetails = await contract.organizations(organizationsAddress);
    console.log("name: " + organizationsDetails[0]);
    console.log("symbol: " + organizationsDetails[1]);
    console.log("orgAddress: " + organizationsDetails[2]);
    console.log("initialSupply: " + organizationsDetails[3]);
    console.log("tokenAddress: " + organizationsDetails[4]);
    document.getElementById("organizationsOutput").innerText = "Stakeholders details: " + "\n" +
    "name: " + organizationsDetails[0] + "\n" +
    "symbol: " + organizationsDetails[1] + "\n" +
    "orgAddress: " + organizationsDetails[2] + "\n" +
    "initialSupply: " + organizationsDetails[3] + "\n" +
    "tokenAddress: " + organizationsDetails[4];
}

async function stakeholders() {
  const stakeholdersAddress = document.getElementById("stakeholdersAddress").value;
  console.log("Fetching the details of this stakeholder!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  
  const stakeholdersDetails = await contract.stakeholders(stakeholdersAddress);
    console.log("amount: " + stakeholdersDetails[0]);
    console.log("vestingPeriod_Timelock: " + stakeholdersDetails[1]);
    console.log("releaseTime: " + stakeholdersDetails[2]);
    console.log("isWhitelisted: " + stakeholdersDetails[3]);
    console.log("stakeholderType: " + stakeholdersDetails[4]);
    document.getElementById("organizationsOutput").innerText = "Stakeholders details: " + "\n" +
    "amount: " + stakeholdersDetails[0] + "\n" +
    "vestingPeriod_Timelock: " + stakeholdersDetails[1] + "\n" +
    "releaseTime: " + stakeholdersDetails[2] + "\n" +
    "isWhitelisted: " + stakeholdersDetails[3] + "\n" +
    "stakeholderType: " + stakeholdersDetails[4];
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(`Completed with ${transactionReciept.confirmations} confirmations`);
      resolve()
    })
  });
}