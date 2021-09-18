import Avatar from '../avatar/Avatar'
import React from 'react'
import './Chatter.css'

const MESSAGE_INTERVAL = Number(process.env.REACT_APP_MESSAGE_INTERVAL);

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
			messages: props.messages,
			timeStamp: 0,
			currentMessage: null,
			timerID: null
		};
	}

	componentDidMount() {
		// The component could have been mounted with valid messages passed into the component.
		// Just kick off a timer here to begin the normal message processing.
		setTimeout(() => this.popMessage(), 100);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.key === prevProps.key) {
			if (this.state.timeStamp < prevProps.timeStamp) {
				let messages = this.state.messages.concat(prevProps.messages);
				
				let timerID = null;
				if (this.state.timerID == null) {
					// Set a small timeout to call the popMessage function to give the component time to
					// propagate the updated data to the state.
					timerID = setTimeout(() => this.popMessage(), 100);
				}

				this.setState({
					messages: messages,
					timeStamp: prevProps.timeStamp,
					timerID: timerID
				});
			}
		}
	}

	popMessage() {
		let messages = this.state.messages;

		if (messages.length > 0) {
			let item = messages.shift();

			// Always set a timer. This gives the previous message time to render if it is the last message
			// in the queue.
			let timerID = setTimeout(() => this.popMessage(), MESSAGE_INTERVAL);

			this.setState({
				messages: messages,
				currentMessage: this.parseMessage(item),
				timerID: timerID
			});
		} else {
			this.setState({
				timerID: null
			})
		}
	}

	parseMessage(message) {
		let result = null;

		if (!message) {
			return result;
		}

		let contents = message.message;

		if (message.emotes.length > 0) {
			contents = [];
			let index = 0;
			while (index < message.message.length) {
				let nextEmoteString = "";
				let nextEmoteURL = "";
				let nextEmoteIndex = -1;
				for (let item of message.emotes) {
					let possible = message.message.indexOf(item.emoteString, index);
					if (possible !== -1) {
						if (nextEmoteIndex === -1 || possible < nextEmoteIndex) {
							nextEmoteString = item.emoteString;
							nextEmoteURL = item.emoteURL;
							nextEmoteIndex = possible;
						}
						
					}
				}

				if (nextEmoteIndex !== -1) {
					let sub = message.message.substr(index, nextEmoteIndex - index);
					contents.push(sub);
					index = nextEmoteIndex + nextEmoteString.length;

					contents.push(<img key={nextEmoteString + String(nextEmoteIndex)} src={nextEmoteURL} alt={nextEmoteString} />);
				} else {
					let sub = message.message.substr(index, message.message.length - index);
					contents.push(sub);
					index = message.message.length;
				}
			}
		}

		result = {
			message: contents,
			timeStamp: message.timeStamp
		};

		return result;
	}

	render() {
		return (
			<div className="Chatter">
				<NamePlate name={this.state.name} />
				<Avatar id={this.state.name} />
				{this.state.currentMessage && <ChatBubble key={this.state.currentMessage.timeStamp} message={this.state.currentMessage.message} />}
			</div>
		)
	}
}
