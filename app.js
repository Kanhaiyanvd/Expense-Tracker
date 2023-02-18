const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
app.use(cors())

const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const userRoutes = require('./routes/user');
const expenseRoutes= require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const premiumFeatureRoute = require('./routes/premiumFeature');
const Order = require('./models/order');

app.use(bodyParser.json({ extended: false }));
//app.use(bodyParser.json)

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoute);
app.use(premiumFeatureRoute );

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
 //.sync({force: true})
 .sync()
 .then(result =>{
    app.listen(3000);
 })
 .catch(err => console.log(err));

//app.listen(3000);