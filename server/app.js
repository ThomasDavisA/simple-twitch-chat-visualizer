const tmi = require('tmi.js');

const client = new tmi.Client({
	channels: [ 'kealldin' ]
});

const userList = {}

client.connect();

client.on('join', (channel, username, self) => {
	if (self) return;
	console.log(`${username} has joined ${channel}`);
	userList[username] = {};
})

client.on('part', (channel, username, self) => {
	console.log(`${username} has left ${channel}`);
	delete userList[username];
})

client.on('message', (channel, tags, message, self) => {
	//ignore commands for now
	if(self || message.startsWith('!')) return;
	
	console.log(`${tags['display-name']}: ${message}`);
	console.log(tags);
	const userStatus = {
		userName: tags['display-name'],
		userSubBadge: tags['badge-info'],
		isUserSubbed: tags.subscriber,
		userColor: tags.color,
		userMessage: message
	}
	userList[tags.username] = userStatus;
});

//debug
setInterval(() => {
		console.log(userList);
}, 3000);