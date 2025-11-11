const mongoose = require('mongoose');

require('dotenv').config();

const Mongo_URI = process.env.MONGO_URI ;

const ConnectDB = async() => {
    
    try {
        await mongoose.connect(Mongo_URI);
        console.log('database connected');
    } catch (error) {
       
       console.log(error);
       process.exit(1);
    }
};

module.exports = ConnectDB;