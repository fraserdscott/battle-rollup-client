
import './App.css';
import { BigNumber, ethers } from "ethers";
import { useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";
import { getBalances } from './Deposit';

const ROLLUP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const withdraw = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()
  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  const to = await signer.getAddress();

  const balances = await getBalances();

  const address1 = ethers.utils.zeroPad("0xd7f0a106f8d065c48a5429fdecdc5e69b793f655", 32);
  const balance1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from("5000000000000000000")), 32)

  const address2 = ethers.utils.zeroPad("0x0000000000000000000000000000000000000000", 32);
  const balance2 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from("0")), 32)
  const address3 = ethers.utils.zeroPad("0x0000000000000000000000000000000000000000", 32);
  const balance3 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from("0")), 32)

  const hash1 = await contract.hashLeftRight(address1, balance1);
  const hash2 = await contract.hashLeftRight(address2, balance2);
  const hash3 = await contract.hashLeftRight(address3, balance3);
  const hash4 = await contract.hashLeftRight(hash2, hash3);

  const pathElements = [hash1, hash4];
  const pathIndices = [0, 0];
  contract.withdraw(to, balances[to], pathElements, pathIndices);
}

const Withdraw = () => {
  return (
    <div>
      <button onClick={() => withdraw()}>Withdraw</button>
    </div>
  )
}

export default Withdraw;
