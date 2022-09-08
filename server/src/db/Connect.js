const mongoose = require('mongoose');

const connectToDB = async (uri) => {
    return mongoose.connect(uri);
}

module.exports = connectToDB;