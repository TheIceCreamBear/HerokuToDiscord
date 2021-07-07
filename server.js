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

    // send 200 to heroku
    res.sendStatus(200);

    const discordJson = {
        content: `Action ${payload.action} occured for app ${payload.data.name}`
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
        console.log(response);
        if (error) {
            throw new Error(error);
        }
    });
});

app.listen(PORT, () => console.log(`Running on PORT=${PORT}`));