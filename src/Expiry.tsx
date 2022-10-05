
import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";
import { ROLLUP_ADDRESS } from './Withdraw';

export const getExpiry = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner()

  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  return contract.expiry();
}

export const Expiry = () => {
  const [expiry, setExpiry] = useState(0);

  useEffect(() => {
    getExpiry().then(b => setExpiry(b))
  });

  return (<div>
    <div><i>The rollup will freeze at {new Date(expiry * 1000).toLocaleString()}.</i></div>
    <div style={{ fontSize: 12 }}><i>the rollup can process up to 32 transactions. pls no spam</i></div>
  </div>
  )
}

export default Expiry;
