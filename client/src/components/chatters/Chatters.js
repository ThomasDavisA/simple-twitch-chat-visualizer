import React from 'react'
import './Chatters.css'

function Avatar(props) {
	return (
		<img className="Avatar" src={window.location.origin + "/logo192.png"} alt="Avatar"></img>
	)
}

function NamePlate(props) {
	return (
		<div className="NamePlate">
			{props.name}
		</div>
	)
}

function Chatter(props) {
	return (
		<div className="Chatter">
			<Avatar />
			<NamePlate name={props.name} />
		</div>
	)
}

export default class Chatters extends React.Component {
	constructor(props) {
		super(props)
		this.state = {Items: [1, 2, 3]};
	}

	componentDidMount() {
		this.TimerID = setInterval(
			() => this.Request(),
			3000
		);
	}

	componentWillUnmount() {
		clearInterval(this.TimerID);
	}

	Request() {
		let Count = Math.max(Math.floor(Math.random() * 5), 1);

		let Items = [];
		for (let I = 0; I < Count; I++) {
			let ID = Math.floor(Math.random() * 1000);
			Items.push(ID);
		}

		this.setState({Items: Items});
	}

	render() {
		return (
		<div>
			<h2>Chatters</h2>
			<ul className="Chatters"> {
				this.state.Items.map(Item => <li><Chatter name={Item}/></li>)
			}
			</ul>
		</div>
		);
	}
}
