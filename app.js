document.addEventListener("DOMContentLoaded", async () => {
  const alchemyKey = 'BUUczsUz__eVJKDXm_c4DW5ugPSoGyhf'; // Replace with your Alchemy API key
  const web3 = new Web3(new Web3.providers.HttpProvider(alchemyKey));

  const contractAbi = require('./NekoFrensABI.json'); // Replace with your ABI file
  const contractAddress = '0xDf8d126474d3aFd2d8082453540014b503bf0012'; // Replace with your contract address

  const nftContract = new web3.eth.Contract(contractAbi, contractAddress);

  const connectWalletButton = document.getElementById('connectWalletButton');
  const mintButton = document.getElementById('mintButton');

  let connected = false;
  let walletConnector = null;

  // Initialize WalletConnect
  const initWalletConnect = async () => {
    walletConnector = new WalletConnect({ bridge: 'https://bridge.walletconnect.org' });

    if (walletConnector.connected) {
      connected = true;
      updateMintButtonStatus();
    }
  };

  // Connect wallet using WalletConnect
  connectWalletButton.addEventListener('click', async () => {
    if (!walletConnector) {
      await initWalletConnect();
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
});
