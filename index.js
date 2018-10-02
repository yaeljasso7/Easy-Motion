//app.js
require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.listen(process.env.PORT, () => console.log('App listening on port 3000'));
