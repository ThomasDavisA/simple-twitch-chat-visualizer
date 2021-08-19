import react from 'react'
import './Avatar.css'

export default class Avatar extends react.Component {
	render() {
		return (
			<img className="Avatar" src={window.location.origin + "/logo192.png"} alt="Avatar"></img>
		)
	}
}
