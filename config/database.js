const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_URI} = process.env;


const connection = async()=>{
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(()=>{
            console.log('MongoDB Connected');
        })
        .catch((error)=>{
            console.log("database connection error !")
            console.error(error);
        });
    };

module.exports = connection;