import './App.css';
import Events from "./Events";
import Deposit from './Deposit';
import Transfer from './Transfer';
import Withdraw from './Withdraw';
import { useState } from 'react';
import Balances from './Balances';
import Expiry from './Expiry';

const mapping = {
  0: <Deposit />,
  1: <Transfer />,
  2: <Withdraw />
}

function App() {
  const [action, setAction] = useState<0 | 1 | 2>(0);

  return (
    <div className="App">
      <h1>
        <del style={{ fontSize: 15 }}>BATTLE</del> PAYMENTS ROLLUP
      </h1>
      <div style={{ margin: 8 }}>
        <Expiry />
      </div>
      <div>
        <Balances />
        <div style={{ border: "solid", margin: 10 }}>
          <h2>
            Actions
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <button style={action === 0 ? { backgroundColor: "grey", color: "white" } : {}} onClick={() => setAction(0)}>Deposit</button>
              <button style={action === 1 ? { backgroundColor: "grey", color: "white" } : {}} onClick={() => setAction(1)}>Transfer</button>
              <button style={action === 2 ? { backgroundColor: "grey", color: "white" } : {}} onClick={() => setAction(2)}>Withdraw</button>
            </div>
            <button onClick={() => {
              //@ts-ignore
              window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                  chainId: "0x385",
                  rpcUrls: ["https://l2.op-bedrock.lattice.xyz"],
                  chainName: "Lattice bedrock-optimism L2",
                  nativeCurrency: {
                    name: "GAR",
                    symbol: "GAR",
                    decimals: 18
                  },
                }]
              });
            }}>Switch network
            </button>
          </div>
          <div style={{ padding: 20 }}>
            {mapping[action]}
          </div>
        </div>
      </div>
      <div style={{ border: "solid", margin: 10 }}>
        <h2>
          Events
        </h2>
        <Events />
      </div>
    </div >
  );
}

export default App;