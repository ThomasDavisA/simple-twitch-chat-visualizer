import React from 'react'
import './Chatters.css'

export default class Chatters extends React.Component {
	constructor(props) {
		super(props)
		this.Items = props.Items
		this.ItemsList = this.Items.map((Item) => <li>{Item}</li>)
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
