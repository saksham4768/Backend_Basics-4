
const mongoose = require('mongoose');

require('dotenv').config();

const DBConnect = () =>{
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("DataBase Connection Successfull"))
    .catch((err) => {
        console.log("Issue in DB Connection");
        console.error(err);
        process.exit(1);
    })
}

module.exports = DBConnect;