
import './App.css';
import { BigNumber, ethers } from "ethers";
import { abi } from "./out/Rollup.sol/Rollup.json";
import { getBalances } from './Balances';
import { useEffect, useState } from 'react';
import { getExpiry } from './Expiry';

export const ROLLUP_ADDRESS = "0x721a1ecb9105f2335a8ea7505d343a5a09803a06";

const withdraw = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()
  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  const to = await signer.getAddress();

  const balances = await getBalances();

  const address1 = ethers.utils.zeroPad("0x0000000000000000000000000000000000000000", 32);
  const balance1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from("0")), 32)
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
  contract.withdraw(to, balances[to.toLowerCase()], pathElements, pathIndices);
}

const Withdraw = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [expiry, setExpiry] = useState(0);

  useEffect(() => {
    getBalances().then(async (bs) => {
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()

      const to = await signer.getAddress();

      setBalance(bs[to.toLowerCase()] || BigNumber.from(0));

      getExpiry().then(e => setExpiry(e));
    });
  });

  const open = Date.now() < expiry * 1000;

  return (
    <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', borderStyle: "groove", padding: 20 }}>
      <span>{open ? `When the rollup is resolved, providing your balance has not changed, you will be able to withdraw ${ethers.utils.formatEther(balance)} ETH.` : `You are about to withdraw ${ethers.utils.formatEther(balance)} ETH.`}</span>
      <button disabled={open} onClick={() => withdraw()}>Withdraw</button>
    </div>
  )
}

export default Withdraw;
