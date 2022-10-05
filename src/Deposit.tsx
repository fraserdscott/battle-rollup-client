
import './App.css';
import { BigNumber, ethers } from "ethers";
import { useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";
import { ROLLUP_ADDRESS } from './Withdraw';

const deposit = async (value: BigNumber) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner()

  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  const ethValue = value.mul(BigNumber.from("1000000000000000000"));

  contract.deposit({ value: ethValue });
}

const Deposit = () => {
  const [value, setValue] = useState(BigNumber.from(0));

  return (
    <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', borderStyle: "groove", padding: 20 }}>
      <input onChange={event => setValue(BigNumber.from(event.target.value))} type="number" name="value" placeholder='Value (ETH)' />
      <button onClick={() => deposit(value)}>Deposit</button>
    </div>
  )
}

export default Deposit;
