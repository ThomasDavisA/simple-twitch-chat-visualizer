const FS_EVENTS = {
	ADD_USER: 1,
	REMOVE_USER: 2
}

var users = {}

function fetchstore(data, callback) {
	for (const key in data.users) {
		let user = data.users[key];

		if (!(user.userId in users)) {
			callback(FS_EVENTS.ADD_USER, user);
		}

		users[user.userId] = {
			displayName: user.displayName,
			isStreamer: user.isStreamer
		};
	}

	// Check for any users that don't exist anymore.
	let toRemove = [];
	for (const key in users) {
		let user = users[key];
		if (!(key in data.users)) {
			callback(FS_EVENTS.REMOVE_USER, user);
			toRemove.push(key);
		}
	}

	for (const key of toRemove) {
		delete users[key];
	}
}

export { fetchstore, FS_EVENTS };
