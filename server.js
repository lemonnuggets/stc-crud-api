require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8888;

const userRoute = require("./routes/user");
app.use("/user", userRoute);

app.get("/", (req, res) => {
    res.send("at homepage");
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
