const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const compression = require('compression');
require('dotenv').config()

const app = express();

const cors = require('cors');
const helmet = require('helmet');
app.use(cors());
app.use(helmet());
app.use(compression());

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');
const DownloadedFile = require('./models/downlededFile');

const userRoutes = require('./routes/user');
const expenseRoutes= require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const resetpasswordRoute = require('./routes/resetpassword');
const premiumFeatureRoute = require('./routes/premiumFeature');

app.use(bodyParser.json({ extended: false }));
//app.use(bodyParser.json)

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoute);
app.use(premiumFeatureRoute );
app.use('/password',resetpasswordRoute);

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
