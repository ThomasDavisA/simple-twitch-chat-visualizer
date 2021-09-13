const tmi = require('tmi.js');
const express = require('express');
const cors = require('cors');

const { getTwitchToken, getUserByUsername } = require('./twitch-api-service');

const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions))

const { NODE_ENV, PORT, CHANNELS } = require('./config');

const client = new tmi.Client({
	channels: [ CHANNELS ]
});

const userList = {};
const userMessages = [];
let twitchAccessToken = '';

getTwitchToken().then((token) => {
	twitchAccessToken = token;
})

client.connect();

//make sure to get the current room when you first start up 

client.on('join', (channel, username, self) => {
	if (self || username === 'streamlabs') return;
	console.log(`${username} has joined ${channel}`);
	if(!userList[username]) {
		userList[username] = {};
		getUserByUsername(username, twitchAccessToken)
			.then(res => {
				const userStatus = {
					userName: username,
					displayName: res.display_name,
					userMessage: `${res.display_name} has joined the den!`,
					timeStamp: Date.now(),
					userId: res.id,
				}
				userList[username] = userStatus;
			});
		
	}
})

client.on('part', (channel, username, self) => {
	console.log(`${username} has left ${channel}`);
	delete userList[username];
})

client.on("ban", (channel, username, reason, userstate) => {
    console.log(`${username} has been banned from the den! ${channel}`)
	delete userList[username];
});

client.on('message', (channel, tags, message, self) => {
	//ignore commands for now
	if (self || message.startsWith('!')) return;
	if (tags.username === 'streamlabs' || tags.username === 'pretzelrocks') return;
	
	console.log(`${tags['display-name']}: ${message}`);
	//console.log(tags);
	let messageToSend = message;
	let emoteOnlyMessage = false;
	const emotesList = [];
	if (tags.emotes) {
		const emoteSize = `3.0`;
		if(tags['emote-only']) {
			emoteOnlyMessage = true;
		}
		Object.entries(tags.emotes).forEach(
			([key, value]) => {
				
				const stringToCut = value[0].split('-')
				const emoteString = message.substr(stringToCut[0], stringToCut[1] - stringToCut[0] + 1);

				const currentEmote = {
					emoteId: key,
					emoteCounted: value.length,
					emoteString,
					emoteURL: `http://static-cdn.jtvnw.net/emoticons/v1/${key}/${emoteSize}`
				}

				emotesList.push(currentEmote);
			})
	}

	const userStatus = {
		userName: tags.username,
		displayName: tags['display-name'],
		userSubBadge: tags['badge-info'],
		isUserSubbed: tags.subscriber,
		userColor: tags.color,
		userMessage: messageToSend,
		userId: tags['user-id'],
		timeStamp: tags['tmi-sent-ts']
	}
	userList[tags.username] = userStatus;

	const messageToStore = {
		userId: tags['user-id'],
		message: messageToSend,
		emotes: emotesList ?? null,
		emoteOnlyMessage,
		timeStamp: tags['tmi-sent-ts']
	}
	console.log(messageToStore);
	userMessages.push(messageToStore);
});

app.get('/api/users', function (req, res) {
	res.json(userList)
  })

app.get('/api/users/messages', function (req, res) {
	let sendMessages = JSON.parse(JSON.stringify(userMessages));
	console.log(sendMessages)
	userMessages.length = 0;
	res.json(sendMessages)
})

app.use(function errorHandler(error, req, res, next) {
    let response
    console.log(error)
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

app.listen(PORT, () => {
	console.log(`Server Listening at http://localhost:${PORT}`)
})

//debug
// setInterval(() => {
// 	console.log(userList);
// }, 10000);