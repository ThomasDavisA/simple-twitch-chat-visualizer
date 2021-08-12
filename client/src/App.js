import './App.css';
import Chatters from './components/chatters/Chatters'

function App() {
  const Items = ["One", "Two", "Three"]
  return (
    <div className="App">
      <Chatters Items={Items}/>
    </div>
  );
}

export default App;
