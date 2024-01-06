require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const routes = require('./routes');
const app = new express();

const path = require('path');
const i18n = require('i18n');
const cors = require('cors');


i18n.configure({
    directory: path.join(__dirname, '/trans')
})

//Prevent node to break if uncaught exception happened
process.on('uncaughtException', function (err) {
    console.log(err, err.message);
});

const corsOptions = {};

app.use('*', cors(corsOptions));

app.use(
    parser.json({limit: '20mb'})
);

app.use(parser.urlencoded({
    extended: true,
    limit: '20mb'
}));

app.use(routes);

const PORT = process.env.PORT || 4200;
app.listen(PORT);
