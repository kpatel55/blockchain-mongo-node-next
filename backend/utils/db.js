const mongoose = require('mongoose');

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
};