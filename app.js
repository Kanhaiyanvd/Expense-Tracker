const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
app.use(cors())

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes= require('./routes/expense');
app.use(bodyParser.json({ extended: false }));
//app.use(bodyParser.json)

app.use(userRoutes);
app.use(expenseRoutes);

sequelize
 .sync()
 .then(result =>{
    app.listen(3000);
 })
 .catch(err => console.log(err));

//app.listen(3000);