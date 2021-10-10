
const PORT = 3000;

const express = require('express');

const appExpress = express();

appExpress.use(express.static('public'))

appExpress.listen(PORT, () => {
	console.log(`Server Listening at http://localhost:${PORT}`)
})