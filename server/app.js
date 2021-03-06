const tmi = require('tmi.js');
const express = require('express');
const cors = require('cors');
const crypto = require("crypto");
const { NODE_ENV, PORT, CHANNELS, MY_TWITCH_SIGNING } = require('./config');

const { getTwitchToken, getUserByUsername } = require('./twitch-api-service');

const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
}

const https = require("https"),
	fs = require("fs"),
	helmet = require("helmet");

const options = {
	key: fs.readFileSync(`C:/Certbot/live/koboldchatterers.com/privkey.pem`),
	cert: fs.readFileSync(`C:/Certbot/live/koboldchatterers.com/fullchain.pem`),
};

//Twitch Verify code
const verifyTwitchSignature = (req, res, buf, encoding) => {
	const messageId = req.header("Twitch-Eventsub-Message-Id");
	const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
	const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
	const time = Math.floor(new Date().getTime() / 1000);
	console.log(`Message ${messageId} Signature: `, messageSignature);
  
	if (Math.abs(time - timestamp) > 600) {
	  // needs to be < 10 minutes
	  console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
	  throw new Error("Ignore this request.");
	}
  
	if (!MY_TWITCH_SIGNING) {
	  console.log(`Twitch signing secret is empty.`);
	  throw new Error("Twitch signing secret is empty.");
	}
  
	const computedSignature =
	  "sha256=" +
	  crypto
		.createHmac("sha256", MY_TWITCH_SIGNING)
		.update(messageId + timestamp + buf)
		.digest("hex");
	console.log(`Message ${messageId} Computed Signature: `, computedSignature);
  
	if (messageSignature !== computedSignature) {
	  throw new Error("Invalid signature.");
	} else {
	  console.log("Verification successful");
	}
};

const app = express();
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json({verify: verifyTwitchSignature}))

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
	if (self) return;
	if (username === 'streamlabs' || username === 'pretzelrocks' || username === 'streamelements' || username === 'streamcaptainbot') return;
	console.log(`${username} has joined ${channel}`);
	if(!userList[username]) {
		userList[username] = {};
		getUserByUsername(username, twitchAccessToken)
			.then(res => {
				const isStreamer = username === channel.slice(1) ? true : false
				const userStatus = {
					userName: username,
					displayName: res.display_name,
					isStreamer,
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
	if (tags.username === 'streamlabs' || tags.username === 'pretzelrocks' || tags.username === 'streamelements' || tags.username === 'streamcaptainbot') return;
	
	console.log(`${tags['display-name']}: ${message}`);
	//console.log(tags);
	let emoteOnlyMessage = false;
	const emotesList = [];
	if (tags.emotes) {
		const emoteSize = `1.0`;
		if(tags['emote-only']) {
			emoteOnlyMessage = true;
		}
		Object.entries(tags.emotes).forEach(
			([key, value]) => {
				
				const stringToCut = value[0].split('-')
				//const emoteString = message.substr(stringToCut[0], stringToCut[1] - stringToCut[0] + 1);
				const emoteString = message.slice(stringToCut[0], stringToCut[1] - stringToCut[0] + 1);

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
		isStreamer: tags.username === channel.slice(1) ? true : false,
		displayName: tags['display-name'],
		userSubBadge: tags['badge-info'],
		isUserSubbed: tags.subscriber,
		userColor: tags.color,
		userId: tags['user-id'],
		timeStamp: tags['tmi-sent-ts']
	}
	userList[tags.username] = userStatus;

	const messageToStore = {
		userId: tags['user-id'],
		emotes: emotesList ?? null,
		emoteOnlyMessage,
		message,
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

app.post("/webhooks/callback", async (req, res) => {
	const messageType = req.header("Twitch-Eventsub-Message-Type");
	if (messageType === "webhook_callback_verification") {
		console.log("Verifying Webhook");
		return res.status(200).send(req.body.challenge);
	}
	const { type } = req.body.subscription;
	const { event } = req.body;
  
	console.log(
	  `Receiving ${type} request for ${event.broadcaster_user_name}: `,
	  event
	);
  
	res.status(200).end();
});

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

https.createServer(options, app).listen(443);

//debug
// setInterval(() => {
// 	console.log(userList);
// }, 10000);