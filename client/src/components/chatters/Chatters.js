import ChattersContextMenu from './ChattersContextMenu'
import Chatter from './Chatter'
import React from 'react'
import './Chatters.css'

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USERS = process.env.REACT_APP_API_USERS;
const TEST_MESSAGES = process.env.REACT_APP_TEST_MESSAGES === "true";
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
			3000
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
				"3": {userId: "3", displayName: "Chatter 3"}
			};

			if (TEST_MESSAGES) {
				let Keys = Object.keys(result);
				let Index = Math.floor(Math.random() * Keys.length);
				let User = result[Keys[Index]];
				User.timeStamp = Date.now();
				User.userMessage = "This is a message at " + User.timeStamp;
			}

			this.parseUsers(result);
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
		}
	}

	parseUsers(Result) {
		let Items = [];
		for (const Item in Result) {
			let User = Result[Item];
			Items[User.userId] = {
				displayName: User.displayName,
				message: User.userMessage,
				timeStamp: User.timeStamp
			}
		}
		this.setState({Items: Items});
	}

	render() {
		let Items = [];
		for (const Item in this.state.Items) {
			if (!this.state.Removed.includes(Item)) {
				let user = this.state.Items[Item]
				Items.push(<li key={Item} onContextMenu={this.contextMenu.bind(this, Item)}><Chatter key={Item} name={user.displayName} message={user.message} timeStamp={user.timeStamp}/></li>);
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
