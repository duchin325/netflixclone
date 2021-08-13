const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

const app = express();
//IMPORT ROUTES
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

mongoose.connect('mongodb://localhost:27017/netflixmern', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(8000, () => {
    console.log("backend server is running!");
});