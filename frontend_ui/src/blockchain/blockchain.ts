// @ts-ignore
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

const CONTRACT_ADDRESS = "0x7eEb196FCE6d94F8caFD445dbF36f19580e27E0c";
                         

//0x67e88DC23C6F7eB6C964c9C38d9De5E4bf9C1218 //from remix ide
const ABI = ["function setTour(string,string,string) public"];

const AVALANCHE_FUJI_CHAIN_ID = '0xa869' // 43113 in dec


export async function pushToBlockchain(
    tournamentName: string,
    winner: string,
    runnerUp: string
  ): Promise<string> {
  if (!(window as any).ethereum) {
      throw new Error("MetaMask not found.");
    }
  
  // validatation for right network
  const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
  if (chainId != AVALANCHE_FUJI_CHAIN_ID) {
    throw new Error("Please switch to Avalanche Fuji C-Chain network.");
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  const tx = await contract.setTour(tournamentName, winner, runnerUp);
  const receipt = await tx.wait();

  return receipt.transactionHash;
}

