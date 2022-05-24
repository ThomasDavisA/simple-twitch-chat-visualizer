const ENDPOINT = "http://localhost:8000/";
const API_USERS = "api/users";
const API_USERS_MESSAGES = "api/users/messages";

// Debug flags for testing.
const TEST_USERS = true;
const TEST_USERS_RANDOM = false;
const TEST_MESSAGES = false;
const TEST_EMOTES = false;

function fetchTestUsers() {
	let result = {
		"1": {userId: "1", displayName: "Chatter 1"},
		"2": {userId: "2", displayName: "Chatter 2"},
		"3": {userId: "3", displayName: "Chatter 3"},
		"4": {userId: "4", displayName: "Chatter 4 (streamer)", isStreamer: true},
		"5": {userId: "5", displayName: "Chatter 5"},
		"6": {userId: "6", displayName: "Chatter 6"},
	};

	if (TEST_USERS_RANDOM) {
		let keys = Object.keys(result);
		let numToRemove = Math.floor(Math.random() * keys.length);

		for (let I = 0; I < numToRemove; I++) {
			let index = Math.floor(Math.random() * keys.length);
			let key = keys[index];
			delete result[key];
			keys.splice(index, 1);
		}
	}

	return result;
}

function fetchTestMessages(users) {
	let count = Math.max(Math.floor(Math.random() * 5), 1);
	let keys = Object.keys(users);
	let timeStamp = Date.now();

	let result = [];
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

	return result;
}

async function fetchUsers() {
	let response = await fetch(ENDPOINT + API_USERS);
	return await response.json();
}

async function fetchMessages() {
	let response = await fetch(ENDPOINT + API_USERS_MESSAGES);
	return await response.json();
}

async function onFetch(callback) {
	let users = {};
	if (TEST_USERS) {
		users = fetchTestUsers();
	} else {
		users = await fetchUsers();
	}

	let messages = []
	if (TEST_MESSAGES) {
		messages = fetchTestMessages(users);
	}
	else {
		messages = await fetchMessages();
	}

	let data = {
		users,
		messages
	};

	callback(data);
}

/**
 * fetcher
 * 
 * This function will begin the fetching process of retrieving the data from the server about the current
 * state of users and messages.
 * 
 * @param {function} callback This function should accept a single parameter 'data'. This object contains two keys:
 * 		users: A dictionary of users and information about them.
 * 		messages: An array of messages the server has received since the last fetch operation.
 * @param {number} interval The amount of time in milliseconds between requests to the server. The
 * 		default value is 3000.
 */
function fetcher(callback, interval = 3000) {
	if (!callback) {
		console.error("No callback given. Aborting fetcher.");
		return;
	}

	if (typeof(callback) !== 'function') {
		console.error("'callback' parameter given is not a function!");
		return;
	}

	if (typeof(interval) !== 'number') {
		console.error("'interval' parameter must be a number.");
		return;
	}

	console.log("Beginning fetch process on interval " + interval);

	setInterval(() => {
		onFetch(callback);
	}, interval);
}

export { fetcher };
