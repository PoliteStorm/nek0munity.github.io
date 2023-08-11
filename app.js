document.addEventListener("DOMContentLoaded", async () => {
  const alchemyKey = 'BUUczsUz__eVJKDXm_c4DW5ugPSoGyhf'; // Replace with your Alchemy API key
  const web3 = new Web3(new Web3.providers.HttpProvider(alchemyKey));

  const contractAbi = [
   {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},
        {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"flipMintState","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},
        {"inputs":[],"name":"mintCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"mintPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
        {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
        {"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}
  ];

  const contractAddress = '0xDf8d126474d3aFd2d8082453540014b503bf0012'; // Replace with your contract address

  const nftContract = new web3.eth.Contract(contractAbi, contractAddress);

  const connectWalletButton = document.getElementById('connectWalletButton');
  const mintButton = document.getElementById('mintButton');

  let connected = false;
  let walletConnector = null;

  // Initialize WalletConnect and the app
  const initApp = () => {
    walletConnector = new WalletConnect({ bridge: 'https://bridge.walletconnect.org' });

    if (walletConnector.connected) {
      connected = true;
      updateMintButtonStatus();
    }
  };

  // Connect wallet using WalletConnect
  connectWalletButton.addEventListener('click', async () => {
    if (!walletConnector) {
      await initApp();
    }

    if (!walletConnector.connected) {
      try {
        await walletConnector.createSession();
        connected = true;
        updateMintButtonStatus();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  });

  // Mint NFTs using WalletConnect
  mintButton.addEventListener('click', async () => {
    if (connected) {
      await mintNFTs();
    }
  });

  function updateMintButtonStatus() {
    mintButton.disabled = !connected;
  }

  async function mintNFTs() {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    // Estimate gas for the minting transaction
    try {
      const gas = await nftContract.methods.mintNFTs(1).estimateGas({ from: sender });

      // Send the minting transaction
      try {
        const result = await walletConnector.sendTransaction({
          from: sender,
          to: contractAddress,
          data: nftContract.methods.mintNFTs(1).encodeABI(),
          gas,
        });

        console.log('Transaction hash:', result.transactionHash);
        console.log('Receipt:', result);

        // Provide user feedback that the minting was successful
        alert('NFT minted successfully!');
      } catch (error) {
        console.error('Error minting NFTs:', error);
        // Provide user feedback that the minting failed
        alert('Error minting NFTs. Please try again.');
      }
    } catch (error) {
      console.error('Error estimating gas:', error);
      // Provide user feedback that the gas estimation failed
      alert('Error estimating gas. Please try again.');
    }
  }

  // Update mint button status initially
  updateMintButtonStatus();
});

