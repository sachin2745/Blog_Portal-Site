const mongoose = require('mongoose');
require('dotenv').config();

const url =  process.env.MONGODB_URL;
// asynchronous functions - return Promise
mongoose.connect(url)
    .then((result) => {
        console.log('database connected');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = mongoose;