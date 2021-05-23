const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

var expirationCookie = 60000 // 600000 is 10 minutes

const sess = {
  secret: 'Super secret secret',
  rolling: true, // Force cookie to be set on every response, it will reset expiration to maxAge.
  cookie: {
    expires: new Date(Date.now() + expirationCookie),
    maxAge: expirationCookie
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sess));
// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});