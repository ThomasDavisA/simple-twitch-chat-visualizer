import Avatar from '../avatar/Avatar'
import React from 'react'
import './Chatter.css'

function ChatBubble(props) {
	return (
		<div className="ChatBubble">
			{props.message}
		</div>
	)
}

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
			key: props.key,
			name: props.name,
			message: props.message,
			timeStamp: 0
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.key === prevProps.key) {
			if (this.state.timeStamp < prevProps.timeStamp) {
				this.setState({
					message: prevProps.message,
					timeStamp: prevProps.timeStamp
				});
			}
		}
	}

	render() {
		return (
			<div className="Chatter">
				<NamePlate name={this.state.name} />
				<Avatar id={this.state.name} />
				{this.state.message && <ChatBubble key={this.state.timeStamp} message={this.state.message} />}
			</div>
		)
	}
}
