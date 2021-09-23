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

let IDs = {}

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
	constructor(props) {
		super(props);
		this.state = {
			avatarID: props.id,
			isStreamer: props.isStreamer
		};
	}

	render() {
		let { avatarID, isStreamer } = this.state;
		let dragon, avatar = '';

		if (isStreamer) {
			dragon = imgDragon[0];
		}

		if (!(avatarID in IDs)) {
			IDs[avatarID] = {
				head: getRandomElement(imgHeads),
				torso: getRandomElement(imgTorsos),
				legs: getRandomElement(imgLegs),
				kobold: getRandomElement(imgKobold)
			}
		}

		//let head = IDs[ID].head
		//let torso = IDs[ID].torso
		//let legs = IDs[ID].legs

		avatar = !dragon ? IDs[avatarID].kobold : dragon;

		return (
			<div>
				<Part className={dragon ? "Dragon" : "Avatar"} element={avatar} />
				{/* <Part className="Avatar-Row-Child" element={torso} />
				<Part className="Avatar-Row-Child" element={legs} /> */}
			</div>
		)
	}
}
