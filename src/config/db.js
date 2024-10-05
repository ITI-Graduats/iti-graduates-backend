const mongoose = require("mongoose");

const connectDB = async (app) => {
    try {
        const {
            connection: { host },
        } = await mongoose.connect(process.env.DB_URI);

        console.log(`Mongo Connected: ${host}`);

        app.listen(process.env.PORT, () => {
            console.log(`server is listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.log("error connecting to mongodb: " + error.message);
    }
};

module.exports = connectDB;
