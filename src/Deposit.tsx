
import './App.css';
import { gql, useQuery } from '@apollo/client';
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from 'react';

import { abi } from "./out/Rollup.sol/Rollup.json";

const deposit = async (value: BigNumber) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner()

  const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const contract = new ethers.Contract(address, abi, signer);

  const ethValue = value.mul(BigNumber.from("1000000000000000000"));

  contract.deposit({ value: ethValue });
}

const getBalance = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner()

  return signer.getBalance();
}

const ACCOUNT_QUERY = gql`query getAccount($id: ID!){
  account(id: $id) {
    id 
    balance
  }
}`;


const RollupBalance = () => {
  const { data, loading, error } = useQuery(ACCOUNT_QUERY, {
    pollInterval: 500,
    variables: { id: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8" }
  });

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <div>Rollup balance: {ethers.utils.formatEther(data.account.balance)} ETH</div>
}

const Deposit = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [value, setValue] = useState(BigNumber.from(0));

  useEffect(() => { getBalance().then(b => setBalance(b)) });

  return (
    <div>
      <div>Source balance: {ethers.utils.formatEther(balance)} ETH</div>
      <RollupBalance />
      <input onChange={event => setValue(BigNumber.from(event.target.value))} type="number" name="value" placeholder='Value (ETH)' />
      <button onClick={() => deposit(value)}>Deposit</button>
    </div>
  )
}

export default Deposit;
