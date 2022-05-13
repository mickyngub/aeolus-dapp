import { ethers } from "ethers";
import { Contract } from "ethers";

const useContract = (contractAddress: string, contractABI: any) => {
  const contractInterface = new ethers.utils.Interface(contractABI);
  const contractInstance = new Contract(contractAddress, contractInterface);
  return contractInstance;
};

export default useContract;
