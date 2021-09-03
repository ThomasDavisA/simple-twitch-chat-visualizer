import react from 'react'
import './Avatar.css'

function importAll(r) {
	return r.keys().map(r);
}

const imgHeads = importAll(require.context('../../images/head'));
const imgTorsos = importAll(require.context('../../images/torso'));
const imgLegs = importAll(require.context('../../images/legs'));
const imgKobold = importAll(require.context('../../images/kobold'));

var IDs = {}

function getRandomElement(Elements) {
	let Index = Math.floor(Math.random() * Elements.length);
	return Elements[Index];
}

function Part(props) {
	return (
		<img className={props.className} src={props.element.default} alt="Avatar" />
	)
}

export default class Avatar extends react.Component {
	render() {
		let ID = this.props.id
		if (!(ID in IDs)) {
			IDs[ID] = {
				head: getRandomElement(imgHeads),
				torso: getRandomElement(imgTorsos),
				legs: getRandomElement(imgLegs),
				kobold: getRandomElement(imgKobold)
			}
		}
		let head = IDs[ID].head
		let torso = IDs[ID].torso
		let legs = IDs[ID].legs
		let kobold = IDs[ID].kobold
		return (
			<div>
				<Part className="Avatar" element={kobold} />
				{/* <Part className="Avatar-Row-Child" element={torso} />
				<Part className="Avatar-Row-Child" element={legs} /> */}
			</div>
		)
	}
}
