document.addEventListener("DOMContentLoaded", async () => {
  const alchemyKey = 'BUUczsUz__eVJKDXm_c4DW5ugPSoGyhf'; // Replace with your Alchemy API key
  const web3 = new Web3(new Web3.providers.HttpProvider(alchemyKey));

  const contractAbi = require('./NekoFrensABI.json'); // Replace with your ABI file
  const contractAddress = '0xDf8d126474d3aFd2d8082453540014b503bf0012'; // Replace with your contract address

  const nftContract = new web3.eth.Contract(contractAbi, contractAddress);

  const connectWalletButton = document.getElementById('connectWalletButton');
  const mintButton = document.getElementById('mintButton');

  let connected = false;

  connectWalletButton.addEventListener('click', async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        connected = true;
        updateMintButtonStatus();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('No wallet provider available.');
    }
  });

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
    const gas = await nftContract.methods.mintNFTs(1).estimateGas({ from: sender });

    // Send the minting transaction
    try {
      const result = await nftContract.methods.mintNFTs(1).send({
        from: sender,
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
  }
});

