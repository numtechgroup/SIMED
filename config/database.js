const mongoose = require('mongoose');

const { MONGO_URI} = process.env

exports.connect = ()=>{
    return new Promise((resolve, reject) => {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(()=>{
            console.log('MongoDB Connected');
            resolve();
        })
        .catch((error)=>{
            console.log("database connection error !")
            console.error(error)
            reject(error);
        });
    });
}
