
import './App.css';
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";
import { ROLLUP_ADDRESS } from './Withdraw';

const getExpiry = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner()

  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  return contract.expiry();
}

export const Balances = () => {
  const [expiry, setExpiry] = useState(0);

  useEffect(() => {
    getExpiry().then(b => setExpiry(b))
  });

  return (
    <div>
      <div>The rollup will freeze at {new Date(expiry * 1000)}</div>
    </div>
  )
}

export default Balances;
