const mongoose = require("mongoose");
const { bold } = require("colors");

const connectDB = async (app) => {
    try {
        const {
            connection: { host },
        } = await mongoose.connect(process.env.DB_URI);

        console.log(bold(`Mongo Connected: ${host}`.cyan.underline));

        app.listen(process.env.PORT, () => {
            console.log(
                bold(
                    `Server is listening on port ` + `${process.env.PORT}`.green
                )
            );
        });
    } catch (error) {
        console.log(
            bold(`Error connecting to mongodb: `.red.underline) +
                `${error.message}`.red
        );
    }
};

module.exports = connectDB;
