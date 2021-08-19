import Avatar from '../avatar/Avatar'
import React from 'react'
import './Chatters.css'

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
		fetch("http://localhost:8000/api/users")
			.then(res => res.json())
			.then((result) => {
				let Items = [];
				for (const Item in result) {
					Items.push(Item);
				}
				this.setState({Items: Items});
			},
			(error) => {
				console.log("Error: " + error);
			}
		);
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
