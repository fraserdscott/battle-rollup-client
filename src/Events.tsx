
import './App.css';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { abi } from "./out/Rollup.sol/Rollup.json";

const formatAddress = (a: string) => `${a.slice(0, 10)}...`

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const contract = new ethers.Contract(address, abi, signer);

    contract.queryFilter({}).then((es: any) => setEvents(es));
  });

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
          <td>{a.args.from ? formatAddress(a.args.from) : "N/A"}</td>
          <td>{a.args.to ? formatAddress(a.args.to) : "N/A"}</td>
          <td>{a.args.value ? ethers.utils.formatEther(a.args.value) : "N/A"}</td>
        </tr>
      )}
    </table>
  </div>;
}

export default Events;
