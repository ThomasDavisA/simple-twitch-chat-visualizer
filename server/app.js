//const twurpleHttp = require('@twurple/eventsub-http');
const twurpleAuth = require('@twurple/auth')
const twurpleApi = require('@twurple/api')
const twurpleChat = require('@twurple/chat')

const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const { NODE_ENV, PORT, CHANNELS, MY_TWITCH_SIGNING, CLIENT_ID, MY_CLIENT_SECRET } = require('./config');

// Express app and consts for interaction with Kobold Pixi.js client
const corsOptions = { origin: "*", optionsSuccessStatus: 200 }

const app = express();
app.use(cors(corsOptions))
app.use(helmet())

const userList = {};
const userMessages = [];

// App Token Auth for Twitch API
const authProvider = new twurpleAuth.AppTokenAuthProvider(CLIENT_ID, MY_CLIENT_SECRET);
const staticAuth = new twurpleAuth.StaticAuthProvider(CLIENT_ID, authProvider);
const apiClient = new twurpleApi.ApiClient({ authProvider });
const chatClient = new twurpleChat.ChatClient({ staticAuth, channels: [CHANNELS], requestMembershipEvents: true });

// Async functions for ApiClient
async function getUserInfo(username) {
	const user =  await apiClient.users.getUserByName(username);
	return user;
}

chatClient.connect();

chatClient.onJoin(
	(channel, username) => {
		console.log(`${username} has joined ${channel}`);
		if (username === channel) return;
		if (username.includes('justinfan')) return;
		if (username === 'streamlabs' || username === 'pretzelrocks' || username === 'streamelements' || username === 'streamcaptainbot' || username === 'twitch') return;

		if(!userList[username]) {
			userList[username] = {};
			
			getUserInfo(username)
				.then((res) => {
					const isStreamer = username === channel.slice(1) ? true : false
					const userStatus = {
						userName: username,
						displayName: res.displayName || username,
						isStreamer,
						userId: res.id,
					}

					console.log(userStatus)
					userList[username] = userStatus;
				});
		}
	}
);

chatClient.onPart((channel, username) => {
	console.log(`${username} has left ${channel}`);
	delete userList[username];
});

chatClient.onBan((channel, username, reason) => {
    console.log(`${username} has been banned from the den! ${channel}`)
	console.log('Reason: ', reason);
	delete userList[username];
});

chatClient.onMessage((channel, username, message, msgAndUserInfo) => {
	//Ignore commands for now
	const { userInfo } = msgAndUserInfo;
	if (message.startsWith('!')) return;
	if (username === 'streamlabs' || username === 'pretzelrocks' || username === 'streamelements' || username === 'streamcaptainbot') return;
	
	console.log(msgAndUserInfo.date)
	console.log(msgAndUserInfo.emoteOffsets)
	console.log(`${username}: ${message}`);
	const parsedMessage = twurpleChat.parseChatMessage(message, msgAndUserInfo.emoteOffsets);
	let emoteOnlyMessage = false
	const emoteList = parsedMessage.flatMap(x => {
		const {type, id} = x;
		if (type != 'emote') return [];
		const emoteUrl = twurpleChat.buildEmoteImageUrl(id);
		return emoteUrl;
	})

	const userStatus = {
		userName: userInfo.userName,
		isStreamer: userInfo.userName === channel.slice(1) ? true : false,
		displayName: userInfo.displayName,
		userSubBadge: userInfo.userSubBadge,
		isUserSubbed: userInfo.isUserSubbed,
		userColor: userInfo.userColor,
		userId: userInfo.userId,
		timeStamp: msgAndUserInfo.date
	}
	userList[userInfo.userName] = userStatus;

	const messageToStore = {
		userId: userInfo.userId,
		emotes: emoteList, //emotes in urlstrings
		emoteOnlyMessage,
		message,
		timeStamp: msgAndUserInfo.date
	}

	

	userMessages.push(messageToStore);
});

//For Kobold Chatterers Client calls
app.get('/api/users', function (req, res) {
	res.json(userList)
  })

app.get('/api/users/messages', function (req, res) {
	let sendMessages = JSON.parse(JSON.stringify(userMessages));
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
