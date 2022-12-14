
import './App.css';
import { BigNumber, ethers } from "ethers";
import { useState } from 'react';

import { abi } from "./out/Rollup.sol/Rollup.json";
import { ROLLUP_ADDRESS } from './Withdraw';

const transfer = async (to: string, value: BigNumber) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner()

  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  const ethValue = value.mul(BigNumber.from("1000000000000000000"));

  contract.transfer(ethers.utils.zeroPad(to, 32), ethers.utils.hexZeroPad(ethers.utils.hexlify(ethValue), 32));
}


const Transfer = () => {
  const [to, setTo] = useState("0x0000000000000000000000000000000000000000");
  const [value, setValue] = useState(BigNumber.from(0));

  return (
    <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', borderStyle: "groove", padding: 20 }}>
      <div>
        <input onChange={event => setTo(event.target.value)} type="text" name="value" placeholder='Address' />
        <input onChange={event => setValue(BigNumber.from(event.target.value))} type="number" name="value" placeholder='Value (ETH)' />
      </div>
      <button onClick={() => transfer(to, value)}>Transfer</button>
    </div>
  )
}

export default Transfer;
