const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
require('dotenv').config();

// setup app and use bodyparser
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// on post to URL/toDiscord, do this
app.post('/toDiscord', async (req, res) => {
    // get payload
    const payload = req.body;

    // send 204 (no content) to heroku
    res.sendStatus(204);

    const discordJson = {
        content: `[${payload.data.app.name}]: ${getMessage(payload)}`
    };

    const options = {
        method: "POST",
        url: process.env.DISCORD_WEBHOOK,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(discordJson)
    };
    request(options, function(error, response) {
        if (error) {
            throw new Error(error);
        }
    });
});

app.listen(PORT, () => console.log(`Running on PORT=${PORT}`));

// edit these functions to change the messages your webhook creates in discord.

// this example uses build and release actions from heroku.
function getMessage(payload) {
    // ${payload.resource} ${payload.action}, status: ${payload.data.status} 
    let resource = payload.resource;
    switch (resource) {
        case 'build': return onBuild(payload);
        case 'release': return onRelease(payload);
        default: return `An action occured, ${payload.action} ${resource} ${payload.data.status}`;
    }
}

function onBuild(payload) {
    let action = payload.action;
    // if the build was started
    if (action == 'created') {
        return `Build started`;
    }

    // returns the status of the build and pings the discord user specified in the config if present
    return `Build ${payload.data.status} for ${payload.data.release.version}` + (process.env.DISCORD_USER_ID) ? ` (<@${process.env.DISCORD_USER_ID}>)` : ``;
}

function onRelease(payload) {
    let action = payload.action;
    // if the build was started
    if (action == 'created') {
        return `Release v${payload.data.version} Started`;
    }

    return `Release v${payload.data.version} ${payload.data.status}`;
}
