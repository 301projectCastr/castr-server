// Application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});

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
// app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/fetchLast', (req, res) => {
  console.log('in fetch last');
  client.query(`SELECT * FROM pokemon ORDER BY mon_id DESC LIMIT 1;`)
    .then(results => res.send(results.rows[0]))
    .catch(console.log);
});

app.post('/mon', bodyParser, (request, response) => {
  console.log('in post');
  client.query(`INSERT INTO pokemon(user_name, mon_nick, mon_name, image_url, type_one, type_two, wins, losses, levels, hp_stat, atk_stat, def_stat, satk_stat, sdef_stat, speed_stat) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      request.body.user_name,
      request.body.mon_nick,
      request.body.mon_name,
      request.body.image_url,
      request.body.type_one,
      request.body.type_two,
      request.body.wins,
      request.body.losses,
      request.body.levels,
      request.body.hp_stat,
      request.body.atk_stat,
      request.body.def_stat,
      request.body.satk_stat,
      request.body.sdef_stat,
      request.body.speed_stat,
    ])
    .then(console.log('post Complete'))
    .catch(console.error);
});

app.put('/update', bodyParser, (req, res) => {
  console.log('in insert');
  let {mon_id, mon_nick, wins, losses, levels} = req.body;
  client.query(`UPDATE pokemon SET mon_nick=$2, wins=$3, losses=$4, levels=$5 WHERE mon_id=$1`,
    [
      mon_id,
      mon_nick,
      wins,
      losses,
      levels
    ])
    .then(console.log('Update Complete'))
    .catch(console.error);
});

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