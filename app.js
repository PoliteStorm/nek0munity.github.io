const web3 = new Web3('BUUczsUz__eVJKDXm_c4DW5ugPSoGyhf'); // Replace with your Infura URL or provider

const contractAbi = require('./NekoFrensABI.json'); // Replace with your ABI file
const contractAddress = '0xDf8d126474d3aFd2d8082453540014b503bf0012'; // Replace with your contract address

const nftContract = new web3.eth.Contract(contractAbi, contractAddress);

// Function to connect wallet
async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      updateWalletInfo();
      updateMintButtonStatus();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  } else {
    console.error('No wallet provider available.');
  }
}

// Function to update wallet information
async function updateWalletInfo() {
  const accounts = await web3.eth.getAccounts();
  const balanceWei = await web3.eth.getBalance(accounts[0]);
  const balanceMatic = web3.utils.fromWei(balanceWei, 'ether');
  
  document.getElementById('wallet-address').textContent = accounts[0];
  document.getElementById('wallet-balance').textContent = balanceMatic;
}

// Function to update mint button status
function updateMintButtonStatus() {
  const mintButton = document.getElementById('mint-button');
  const connectWalletButton = document.getElementById('connect-wallet');
  
  const connected = web3.currentProvider.selectedAddress !== null;
  const balanceMatic = parseFloat(document.getElementById('wallet-balance').textContent);
  
  connectWalletButton.disabled = connected;
  mintButton.disabled = !connected || balanceMatic < 50;
}

// Connect Wallet button click event
document.getElementById('connect-wallet').addEventListener('click', connectWallet);

// Mint form submit event
document.getElementById('mint-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const quantity = mintForm.quantity.value;
  await mintNFTs(quantity);
});

// Function to mint NFTs
async function mintNFTs(quantity) {
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  // Estimate gas for the minting transaction
  const gas = await nftContract.methods.mintNFTs(quantity).estimateGas({ from: sender });

  // Send the minting transaction
  try {
    const result = await nftContract.methods.mintNFTs(quantity).send({
      from: sender,
      gas,
    });

    console.log('Transaction hash:', result.transactionHash);
    console.log('Receipt:', result);

    // You can provide user feedback that the minting was successful here
  } catch (error) {
    console.error('Error minting NFTs:', error);
    // Provide user feedback that the minting failed
  }
}

// Update mint button status on page load
window.addEventListener('load', () => {
  updateWalletInfo();
  updateMintButtonStatus();
});
