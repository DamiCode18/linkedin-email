const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/api/webhook/resend', async (req, res) => {
    const body = req.body;

    if (body.type === 'email.delivered') {
        console.log(`${body.data.to[0]} is a valid email address`);
    } else if (body.type === 'email.bounced') {
        console.log(`${body.data.to[0]} is not a valid email address`);
    }

    console.log(body);

    res.sendStatus(201);
})

const port = 9000;
app.listen(port, () => console.log(`listening on port ${port}`));