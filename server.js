// Application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Application Middleware
app.use(cors());

// API Endpoints
app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.post('/:user', (req, res) => {
  client.query (
    `INSERT INTO users (user_name)
    VALUES ($1) ON CONFLICT DO NOTHING;`,
    [req.params.user]
  )
    .then(() => res.send(console.log('user added to db')));
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));