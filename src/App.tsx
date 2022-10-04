import './App.css';
import Events from "./Events";
import Deposit from './Deposit';
import Transfer from './Transfer';

function App() {
  return (
    <div className="App">
      <h1>
        BATTLE ROLLUP
      </h1>
      <div>
        <h2>
          Actions
        </h2>
        <h3>Deposit</h3>
        <Deposit />
        <h3>Transfer</h3>
        <Transfer />
      </div>
      <div>
        <h2>
          Events Explorer
        </h2>
        <Events />
      </div>
    </div >
  );
}

export default App;