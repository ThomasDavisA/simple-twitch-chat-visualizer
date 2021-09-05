import './App.css';
import Chatters from './components/chatters/Chatters'

const SOLID_BACKGROUND = process.env.REACT_APP_SOLID_BACKGROUND === "true";

let AppClassName = SOLID_BACKGROUND ? "App-Test" : "App";

function App() {
  return (
    <div className={AppClassName}>
      <Chatters />
    </div>
  );
}

export default App;
