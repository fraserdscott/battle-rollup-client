
import './App.css';
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";

const ROLLUP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const deposit = async (value: BigNumber) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner()

  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  const ethValue = value.mul(BigNumber.from("1000000000000000000"));

  contract.deposit({ value: ethValue });
}

const getSourceBalance = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()

  return signer.getBalance();
}

const getRollupBalance = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()

  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  const events = await contract.queryFilter({});

  let balances: Record<string, BigNumber> = {};
  events.map(e => {
    if (!balances[e.args.from]) {
      balances[e.args.from] = BigNumber.from(0);
    }

    if (e.event === "Deposit") {
      if (!balances[e.args.to]) {
        balances[e.args.to] = BigNumber.from(0);
      }

      balances[e.args.to] = balances[e.args.to].add(BigNumber.from(e.args.value));
    } else if (e.event === "Transfer") {
      const to = e.args.to.slice(0, 2) + e.args.to.slice(26);

      if (!balances[to]) {
        balances[to] = BigNumber.from(0);
      }

      balances[e.args.from] = balances[e.args.from].sub(BigNumber.from(e.args.value));
      balances[to] = balances[to].add(BigNumber.from(e.args.value));
    }
  });

  const address = await signer.getAddress();
  return balances[address];
}

const RollupBalance = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    // @ts-ignore
    getRollupBalance().then((b) => setBalance(b));
  }, []);

  return <div>Rollup balance: {ethers.utils.formatEther(balance)} ETH</div>
}

const Deposit = () => {
  const [sourceBalance, setSourceBalance] = useState(BigNumber.from(0));
  const [value, setValue] = useState(BigNumber.from(0));

  useEffect(() => {
    getSourceBalance().then(b => setSourceBalance(b))
  });

  return (
    <div>
      <div>Source balance: {ethers.utils.formatEther(sourceBalance)} ETH</div>
      <RollupBalance />
      <input onChange={event => setValue(BigNumber.from(event.target.value))} type="number" name="value" placeholder='Value (ETH)' />
      <button onClick={() => deposit(value)}>Deposit</button>
    </div>
  )
}

export default Deposit;
