const fetch = require('node-fetch');
const { CLIENT_ID, MY_CLIENT_SECRET } = require('./config')

module.exports.getTwitchToken = async function() {
    let response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${MY_CLIENT_SECRET}&grant_type=client_credentials`, {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error(`error`);
    }

    const res = await response.json();
    console.log(res);
    const { access_token } = res;
    //console.log(access_token);
    return access_token;
};

module.exports.getUserByUsername = async function(user, auth) {
    console.log(user, auth);
    let response = await fetch(`https://api.twitch.tv/helix/users?login=${user}`, {
        headers: {
            'Authorization': `Bearer ${auth}`,
            'Client-Id': CLIENT_ID
        }
    })

    if (!response.ok) {
        throw new Error(`error`);
    }

    const res = await response.json();
    console.log(res);
}