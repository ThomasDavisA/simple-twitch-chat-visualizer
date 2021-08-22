import react from 'react'
import './Avatar.css'

function importAll(r) {
	return r.keys().map(r);
}

const imgHeads = importAll(require.context('../../images/head'));
const imgTorsos = importAll(require.context('../../images/torso'));
const imgLegs = importAll(require.context('../../images/legs'));

function getRandomElement(Elements) {
	let Index = Math.floor(Math.random() * Elements.length);
	return Elements[Index];
}

function Part(props) {
	return (
		<img className={props.className} src={getRandomElement(props.element).default} alt="Avatar" />
	)
}

export default class Avatar extends react.Component {
	render() {
		return (
			<div>
				<Part className="Avatar" element={imgHeads} />
				<Part className="Avatar-Row-Child" element={imgTorsos} />
				<Part className="Avatar-Row-Child" element={imgLegs} />
			</div>
		)
	}
}
