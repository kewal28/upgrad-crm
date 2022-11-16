//Staring Point

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const serverConfig =  require("./config/server");
const dbConfig =  require("./config/db");

app.use(express.json());

app.listen(serverConfig.PORT, () => {
    console.log(`Application is runing at ${serverConfig.PORT}`);
});

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
    console.log(`Error while connecting to db`);
});

db.once("open", () => {
    console.log(`Connected to db`);
});

require("./routes/auth")(app)