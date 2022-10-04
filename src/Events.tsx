
import './App.css';
import { gql, useQuery } from '@apollo/client';
import { ethers } from "ethers";

const EVENTS_QUERY = gql`{
  events(orderBy: timestamp) {
    id
    timestamp
    ... on DepositEvent {
      to {
        id
      }
      value
    }
    ... on TransferEvent {
      from {
        id
      }
      to {
        id
      }
      value
    }
  }
}`;


const formatAddress = (a: string) => `${a.slice(0, 10)}...`

const Events = () => {
  const { data, loading, error } = useQuery(EVENTS_QUERY, {
    pollInterval: 500,
  });

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <div>
    <table>
      <tr>
        <th>Type</th>
        <th>Timestamp</th>
        <th>From</th>
        <th>To</th>
        <th>Value (ETH)</th>
      </tr>
      {data.events.map((a: any) =>
        <tr>
          <td>{a.from ? "Transfer" : "Deposit"}</td>
          <td>{a.timestamp}</td>
          <td>{a.from ? formatAddress(a.from.id) : "N/A"}</td>
          <td>{formatAddress(a.to.id)}</td>
          <td>{ethers.utils.formatEther(a.value)}</td>
        </tr>
      )}
    </table>
  </div>;
}

export default Events;
