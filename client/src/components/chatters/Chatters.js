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
		this.Items = props.Items
		this.ItemsList = this.Items.map((Item) => <li><Chatter name={Item}/></li>)
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
	}

	render() {
		return (
		<div>
			<h2>Chatters</h2>
			<ul className="Chatters">
				{this.ItemsList}
			</ul>
		</div>
		);
	}
}
