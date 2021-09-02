import ChattersContextMenu from './ChattersContextMenu'
import Chatter from './Chatter'
import React from 'react'
import './Chatters.css'

export default class Chatters extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			Items: {
				"1": {message: "", timeStamp: 0},
				"2": {message: "", timeStamp: 0},
				"3": {message: "", timeStamp: 0}
			},
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
		fetch("http://localhost:8000/api/users")
			.then(res => res.json())
			.then((result) => {
				let Items = [];
				for (const Item in result) {
					Items[Item] = {
						message: result[Item].userMessage,
						timeStamp: result[Item].timeStamp
					}
				}
				this.setState({Items: Items});
			},
			(error) => {
				console.log("Error: " + error);
			}
		);
	}

	render() {
		let Items = [];
		for (const Item in this.state.Items) {
			if (!this.state.Removed.includes(Item)) {
				let user = this.state.Items[Item]
				Items.push(<li onContextMenu={this.contextMenu.bind(this, Item)}><Chatter name={Item} message={user.message} timeStamp={user.timeStamp}/></li>);
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
