require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8888;
const mongoose = require("mongoose");

const dbURI = `mongodb+srv://${process.env.MONGO_USERNAME || "lemonnuggets"}:${
    process.env.MONGO_PASSWORD
}@users.8hezs.mongodb.net/stc-crud?retryWrites=true&w=majority`;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", () => {
    console.log("Error connecting to db");
});
db.once("open", () => {
    console.log("Connected to db");
});

app.use(express.json());

const { usersRouter } = require("./routes/users");
app.use("/users", usersRouter);
const { authRouter } = require("./routes/auth");
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("at homepage");
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
