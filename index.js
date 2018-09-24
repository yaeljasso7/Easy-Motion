//app.js
const express = require('express');
const router = require('./routes')
const app = express();
require('dotenv').config();

app.use(router);

app.listen(process.env.PORT, () => console.log('App listening on port 3000'));
