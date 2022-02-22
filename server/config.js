require('dotenv').config()
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CHANNELS: process.env.CHANNELS,
    CLIENT_ID: process.env.CLIENT_ID,
    MY_CLIENT_SECRET: process.env.MY_CLIENT_SECRET,
    MY_TWITCH_SIGNING: process.env.TWITCH_SIGNING_SECRET
}