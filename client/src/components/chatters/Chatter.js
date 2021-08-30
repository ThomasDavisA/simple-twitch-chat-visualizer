import Avatar from '../avatar/Avatar'
import React from 'react'
import './Chatter.css'

function NamePlate(props) {
	return (
		<div className="NamePlate">
			{props.name}
		</div>
	)
}

export default class Chatter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.name
		}
	}

	render() {
		return (
			<div className="Chatter">
				<Avatar id={this.state.name} />
				<NamePlate name={this.state.name} />
			</div>
		)
	}
}
