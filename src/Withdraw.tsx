
import './App.css';
import { BigNumber, ethers } from "ethers";
import { gql, useQuery } from '@apollo/client';
import { abi } from "./out/Rollup.sol/Rollup.json";

const withdraw = async (to: string, value: BigNumber) => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner()

  const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const contract = new ethers.Contract(address, abi, signer);

  // fix address
  const address1 = ethers.utils.zeroPad("0xd7f0a106f8d065c48a5429fdecdc5e69b793f655", 32);
  const balance1 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from("5000000000000000000")), 32)

  const address2 = ethers.utils.zeroPad("0x0000000000000000000000000000000000000000", 32);
  const balance2 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from("0")), 32)
  const address3 = ethers.utils.zeroPad("0x0000000000000000000000000000000000000000", 32);
  const balance3 = ethers.utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from("0")), 32)

  const hash1 = await contract.hashLeftRight(address1, balance1);
  const hash2 = await contract.hashLeftRight(address2, balance2);
  const hash3 = await contract.hashLeftRight(address3, balance3);
  const hash4 = await contract.hashLeftRight(hash2, hash3);

  const pathElements = [hash1, hash4];
  const pathIndices = [0, 0];
  contract.withdraw(to, value, pathElements, pathIndices);
}

const ACCOUNT_QUERY = gql`query getAccount($id: ID!){
  account(id: $id) {
    id 
    balance
  }
}`;

// Fetch their account and balance from the graph
const Withdraw = () => {
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

  return (
    <div>
      <button onClick={() => withdraw(data.account.id, data.account.balance)}>Withdraw</button>
    </div>
  )
}

export default Withdraw;
