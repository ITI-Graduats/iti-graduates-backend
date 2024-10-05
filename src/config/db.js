const mongoose = require("mongoose");

const connect = async () => {
    try {
        const {
            connection: { host },
        } = await mongoose.connect(process.env.DB_URI);

        console.log(`Mongo Connected: ${host}`);
    } catch (error) {
        throw Error(`Error connecting to mongodb: ${error.message}`);
    }
};

module.exports = { connect };
