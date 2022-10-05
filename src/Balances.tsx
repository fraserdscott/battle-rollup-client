
import './App.css';
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";
import { ROLLUP_ADDRESS } from './Withdraw';

export const getBalances = async () => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()

  const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

  const events = await contract.queryFilter({});

  let balances: Record<string, BigNumber> = {};
  events.map(e => {
    if (e.args) {
      if (e.event === "Deposit") {
        const to = e.args.to.toLowerCase();
        if (!balances[to]) {
          balances[to] = BigNumber.from(0);
        }

        balances[to] = balances[to].add(BigNumber.from(e.args.value));
      } else if (e.event === "Transfer") {
        const from = e.args.from.toLowerCase();
        if (!balances[from]) {
          balances[from] = BigNumber.from(0);
        }

        const to = (e.args.to.slice(0, 2) + e.args.to.slice(26)).toLowerCase();

        if (!balances[to]) {
          balances[to] = BigNumber.from(0);
        }

        const value = BigNumber.from(e.args.value);

        if (balances[from].gte(value)) {
          balances[from] = balances[from].sub(value);
          balances[to] = balances[to].add(value);
        }
      }
    }
  });

  return balances;
}

const getRollupBalance = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()

  const balances = await getBalances();

  const address = await signer.getAddress();

  return balances[address.toLowerCase()] || 0;
}

const RollupBalance = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    // @ts-ignore
    getRollupBalance().then((b) => setBalance(b));
  }, []);

  return <div><b>Rollup balance:</b> {ethers.utils.formatEther(balance)} ETH</div>
}

const getSourceBalance = async () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()

  return signer.getBalance();
}

export const Balances = () => {
  const [sourceBalance, setSourceBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    getSourceBalance().then(b => setSourceBalance(b))
  });

  return (
    <div>
      <div style={{ border: 'solid', padding: 4 }}><b>Source balance:</b> {ethers.utils.formatEther(sourceBalance)} ETH</div>
      <div style={{ border: 'solid', padding: 4 }}><RollupBalance /></div>
    </div>
  )
}

export default Balances;
