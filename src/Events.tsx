
import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";
import { ROLLUP_ADDRESS } from './Withdraw';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const contract = new ethers.Contract(ROLLUP_ADDRESS, abi, signer);

    contract.queryFilter({}).then((es: any) => setEvents(es));
  }, []);

  return <div>
    <table>
      <tr>
        <th>Type</th>
        <th>Block number</th>
        <th>From</th>
        <th>To</th>
        <th>Value (ETH)</th>
      </tr>
      {events.map((a: any) =>
        <tr>
          <td>{a.event}</td>
          <td>{a.blockNumber}</td>
          <td>{a.args.from ? a.args.from : "N/A"}</td>
          <td>{a.args.to ? (a.event === "Transfer" ? a.args.to.slice(0, 2) + a.args.to.slice(26) : a.args.to) : "N/A"}</td>
          <td>{a.args.value ? ethers.utils.formatEther(a.args.value) : "N/A"}</td>
        </tr>
      )}
    </table>
  </div>;
}

export default Events;
