const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require("body-parser");
const cors = require('cors');

const routes = require('./config/router');
const sequelize = require('./config/database');

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static/images", express.static(path.join("static/images")));

const corsOptions = {
    "origin": "*",
    "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
    "allowedHeaders": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

app.use(cors(corsOptions));

app.use(process.env.REST_API_URL, routes);

const User = sequelize.import('./model/user');
const UserProfile = sequelize.import('./model/userProfile');
const Sale = sequelize.import('./model/sale');
const Lot = sequelize.import('./model/lot');


// Database configuration
UserProfile.User = UserProfile.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.UserProfile = User.hasOne(UserProfile);

Lot.Sale = Lot.belongsTo(Sale, { constraints: true, onDelete: 'CASCADE' });
Sale.Lot = Sale.hasMany(Lot);


sequelize
    .sync()
    .then(result => {
        console.log('Connected to database.');
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;
