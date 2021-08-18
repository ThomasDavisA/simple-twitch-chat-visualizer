const tmi = require('tmi.js');
const express = require('express')
const cors = require('cors')

const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions))


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

app.get('/api/users', function (req, res) {
	res.json(userList)
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

app.listen(8000, () => {
	console.log('Server Listening at http://localhost:8000')
})

//debug
setInterval(() => {
		console.log(userList);
}, 3000);