import './App.css';

function Chatters(props) {
  const Items = props.Items
  const ItemsList = Items.map((Item) => <li>{Item}</li>)
  return (
    <div>
      <ul className="Chatters">
        {ItemsList}
      </ul>
    </div>
  )
}

function App() {
  const Items = ["One", "Two", "Three"]
  return (
    <div className="App">
      <h2>Chatters</h2>
      <Chatters Items={Items}/>
    </div>
  );
}

export default App;
