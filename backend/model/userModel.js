const { model, Schema } = require('../connection');

const mySchema = new Schema({

    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    avatar: { type: String, required: true },
    createdAt: Date,
    role: { type: String, default: 'user' },
    // avatar: { type: String, default: 'Shinchan.jpg'},
});

module.exports = model('user', mySchema);