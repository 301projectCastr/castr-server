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
app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.post('/mons', bodyParser, (request, response) => {
  client.query(`INSERT INTO pokemon(user_id, mon_nick, mon_name, image_url, wins, losses, levels, hp_stat, atk_stat, def_stat, satk_stat, sdef_stat, speed_stat) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      request.body.user_id,
      request.body.mon_nick,
      request.body.mon_name,
      request.body.image_url,
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
    .then(() => response.send('Update Complete'))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));