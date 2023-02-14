const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
app.use(cors())

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
app.use(bodyParser.json({ extended: false }));
//app.use(bodyParser.json)

app.use(userRoutes);

sequelize
 .sync()
 .then(result =>{
    app.listen(3000);
 })
 .catch(err => console.log(err));

//app.listen(3000);