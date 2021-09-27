import Avatar from '../avatar/Avatar'
import { ChattersContext } from '../../contexts/ChattersContext';
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
	static contextType = ChattersContext;

	constructor(props) {
		super(props);
		this.state = {
			id: props.id,
			currentMessage: null,
			timerID: null
		};
		this.messages = [];
	}

	popMessage() {
		if (this.messages.length > 0) {
			let item = this.messages.shift();

			// Always set a timer. This gives the previous message time to render if it is the last message
			// in the queue.
			let timerID = setTimeout(() => this.popMessage(), MESSAGE_INTERVAL);

			this.setState({
				currentMessage: this.parseMessage(item),
				timerID: timerID
			});
		} else {
			this.setState({
				timerID: null
			});
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
		let user = this.context.Items[this.state.id];
		if (!user) {
			return (<div />)
		}

		if (user.messages.length > 0) {
			this.messages = this.messages.concat(user.messages);
			user.messages.length = 0;

			if (!this.state.timerID) {
				this.popMessage();
			}
		}

		return (
			<div className="Chatter">
				<NamePlate name={user.displayName} />
				<Avatar id={user.displayName} isStreamer={user.isStreamer} />
				{this.state.currentMessage && <ChatBubble key={this.state.currentMessage.timeStamp} message={this.state.currentMessage.message} />}
			</div>
		)
	}
}
