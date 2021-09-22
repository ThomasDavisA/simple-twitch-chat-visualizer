import ChattersContextMenu from './ChattersContextMenu'
import Chatter from './Chatter'
import React from 'react'
import './Chatters.css'

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USERS = process.env.REACT_APP_API_USERS;
const API_USERS_MESSAGES = process.env.REACT_APP_API_USERS_MESSAGES;
const USERS_INTERVAL = Number(process.env.REACT_APP_USERS_INTERVAL);

const TEST_EMOTES = process.env.REACT_APP_TEST_EMOTES === "true";
const TEST_MESSAGES = process.env.REACT_APP_TEST_MESSAGES === "true" || TEST_EMOTES;
const TEST_USERS = process.env.REACT_APP_TEST_USERS === "true" || TEST_MESSAGES;

export default class Chatters extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			Items: {},
			Removed: [],
			contextMenuTarget: null,
			xPos: "0px",
			yPos: "0px"
		};
		this.onClick = this.onClick.bind(this)
	}

	componentDidMount() {
		this.TimerID = setInterval(
			() => this.Request(),
			USERS_INTERVAL
		);

		document.addEventListener("click", this.onClick);
	}

	componentWillUnmount() {
		clearInterval(this.TimerID);
		document.removeEventListener("click", this.onClick);
	}

	onClick(event) {
		if (this.state.contextMenuTarget) {
			this.setState({contextMenuTarget: null});
		}
	}

	contextMenu(id, event) {
		event.preventDefault();
		this.setState({
			contextMenuTarget: id,
			xPos: event.pageX + "px",
			yPos: event.pageY + "px"
		});
	}

	onContextMenuSelection(id) {
		let Removed = this.state.Removed;
		if (id === "Remove") {
			if (!Removed.includes(this.state.contextMenuTarget)) {
				Removed.push(this.state.contextMenuTarget);
			}
		}
		this.setState({
			contextMenuTarget: null,
			Removed: Removed
		});
	}

	Request() {
		if (TEST_USERS) {
			let result = {
				"1": {userId: "1", displayName: "Chatter 1"},
				"2": {userId: "2", displayName: "Chatter 2"},
				"3": {userId: "3", displayName: "Chatter 3"},
				"4": {userId: "4", displayName: "Chatter 4 (streamer)", isStreamer: true},
				"5": {userId: "5", displayName: "Chatter 5"},
				"6": {userId: "6", displayName: "Chatter 6"},
			};
			
			this.parseUsers(result);

			if (TEST_MESSAGES) {
				let count = Math.max(Math.floor(Math.random() * 5), 1);
				let keys = Object.keys(result);
				let timeStamp = Date.now();

				result = [];
				for (let I = 0; I < count; I++) {
					let index = Math.floor(Math.random() * keys.length);
					let userId = keys[index];
					let message = "This is a message at " + timeStamp;
					let emotes = [];
					let emoteOnly = false;
					
					if (TEST_EMOTES) {
						// Below are some test emotes pulled from data sent by the server. This should be updated if the format changes.
						const testEmotes = [
							{"emoteId":"25","emoteCounted":1,"emoteString":"Kappa","emoteURL":"http://static-cdn.jtvnw.net/emoticons/v1/25/1.0"},
							{"emoteId":"30259","emoteCounted":1,"emoteString":"HeyGuys","emoteURL":"http://static-cdn.jtvnw.net/emoticons/v1/30259/1.0"}
						];

						let num = Math.max(Math.floor(Math.random() * 3), 1);
						message += " with emotes ";
						for (let J = 0; J < num; J++) {
							let emoteIndex = Math.floor(Math.random() * testEmotes.length);
							let emote = testEmotes[emoteIndex];
							message += " " + emote.emoteString;

							let found = false;
							for (let item of emotes) {
								if (item.emoteId === emote.emoteId) {
									found = true;
									break;
								}
							}

							if (!found) {
								emotes.push(emote);
							}
						}
					}

					result.push({
						userId: userId,
						message: message,
						timeStamp: timeStamp,
						emotes: emotes,
						emoteOnly: emoteOnly
					});

					timeStamp += 10;
				}

				this.parseMessages(result);
			}
		}
		else {
			fetch(ENDPOINT + API_USERS)
				.then(res => res.json())
				.then((result) => {
					this.parseUsers(result);
				},
				(error) => {
					console.log("Error: " + error);
				}
			);

			fetch(ENDPOINT + API_USERS_MESSAGES)
				.then(res => res.json())
				.then((result) => {
					this.parseMessages(result);
				},
				(error) => {
					console.log("Error: " + error);
				}
			);
		}
	}

	parseUsers(Result) {
		let Items = [];
		for (const Item in Result) {
			let User = Result[Item];
			Items[User.userId] = {
				displayName: User.displayName,
				isStreamer: User.isStreamer,
				messages: [],
				timeStamp: 0
			}
		}
		this.setState({Items: Items});
	}

	parseMessages(result) {
		let items = this.state.Items;
		for (const item of result) {
			if (item.userId in items) {
				let user = items[item.userId];

				user.messages.push({
					message: item.message,
					timeStamp: item.timeStamp,
					emotes: item.emotes,
					emoteOnly: item.emoteOnly
				});

				user.timeStamp = item.timeStamp;
			} else {
				console.log("Received message from invalid user: " + item.userId);
			}
		}

		this.setState({
			Items: items
		})
	}

	render() {
		let Items = [];
		for (const Item in this.state.Items) {
			if (!this.state.Removed.includes(Item)) {
				let user = this.state.Items[Item]
					Items.push(<li key={Item} onContextMenu={this.contextMenu.bind(this, Item)}><Chatter key={Item} name={user.displayName} isStreamer={user.isStreamer} messages={user.messages} timeStamp={user.timeStamp}/></li>);
			}
		}
		return (
		<div>
			<h2>Chatters</h2>
			<ul className="Chatters"> {
				Items
			}
			</ul> {
				this.state.contextMenuTarget && <ChattersContextMenu onItemSelected={(id) => this.onContextMenuSelection(id)} xPos={this.state.xPos} yPos={this.state.yPos}/>
			}
		</div>
		);
	}
}
