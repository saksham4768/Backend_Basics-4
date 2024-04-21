
const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 4000;
app.use(express.json());

const dbConnect = require('./config/DataBase');
dbConnect();

//route import and mount
const user = require('./routes/user');
app.use('/api/v1', user);

//Server Activate
app.listen(PORT, () =>{
    console.log(`Server started successfully at PORT Number ${PORT}`);
})