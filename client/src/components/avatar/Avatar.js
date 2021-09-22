import react from 'react'
import './Avatar.css'

function importAll(r) {
	return r.keys().map(r);
}

const imgHeads = importAll(require.context('../../images/head'));
const imgTorsos = importAll(require.context('../../images/torso'));
const imgLegs = importAll(require.context('../../images/legs'));
const imgKobold = importAll(require.context('../../images/kobold'));
const imgDragon = importAll(require.context('../../images/dragon'));

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
		let dragon = '';
		let avatar = '';

		if (this.props.isStreamer) {
			dragon = imgDragon[0];
		}

		if (!(ID in IDs)) {
			IDs[ID] = {
				head: getRandomElement(imgHeads),
				torso: getRandomElement(imgTorsos),
				legs: getRandomElement(imgLegs),
				kobold: getRandomElement(imgKobold)
			}
		}

		//let head = IDs[ID].head
		//let torso = IDs[ID].torso
		//let legs = IDs[ID].legs

		if (!dragon) {
			avatar = IDs[ID].kobold
		}
		else {
			avatar = dragon
		}

		return (
			<div>
				<Part className={dragon ? "Dragon" : "Avatar"} element={avatar} />
				{/* <Part className="Avatar-Row-Child" element={torso} />
				<Part className="Avatar-Row-Child" element={legs} /> */}
			</div>
		)
	}
}
