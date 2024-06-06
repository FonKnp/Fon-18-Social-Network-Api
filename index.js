const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extened: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
  app.listin(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
});