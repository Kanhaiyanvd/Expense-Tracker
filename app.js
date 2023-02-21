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
const resetpasswordRoute = require('./routes/resetpassword');
const premiumFeatureRoute = require('./routes/premiumFeature');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');

app.use(bodyParser.json({ extended: false }));
//app.use(bodyParser.json)

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoute);
app.use(premiumFeatureRoute );
app.use(resetpasswordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


sequelize
 //.sync({force: true})
 .sync()
 .then(result =>{
    app.listen(3000);
 })
 .catch(err => console.log(err));

//app.listen(3000);