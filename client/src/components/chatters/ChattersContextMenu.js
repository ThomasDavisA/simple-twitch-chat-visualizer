import React from 'react'
import './ChattersContextMenu.css'

export default class ChattersContextMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			xPos: props.xPos,
			yPos: props.yPos,
			onItemSelected: props.onItemSelected,
			options: [
				"Remove"
			]
		}
	}

	onItemSelected(id, event) {
		if (this.state.onItemSelected) {
			this.state.onItemSelected(id);
		}
	}

	render() {
		return (
			<div>
				<ul className="List" style={{top: this.state.yPos, left: this.state.xPos}}> {
					this.state.options.map(Item => <li onClick={this.onItemSelected.bind(this, Item)}>{Item}</li>)
				}
				</ul>
			</div>
		)
	}
}
