const mongoose = require('mongoose');
const { EnviromentVariables } = require('./EnvironmentVariables');

const DB_Connection_String = EnviromentVariables.MONGODB_URL;

exports.DBCONNECTION = async () => {
    try {
        if (!DB_Connection_String) {
            throw new Error(
                "MONGODB_URL is not defined in the environment variables"
            );
        }
        await mongoose.connect(DB_Connection_String);

        if (mongoose.connection.host === "0.0.0.0") {
            console.log("You're Connected to Local Host");
        } else {
            console.log("You're Connected To Live");
        }
    } catch (error) {
        console.log("Database connection error. Couldn't connect because ", error);
    }
};