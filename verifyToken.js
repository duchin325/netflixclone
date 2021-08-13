const jwt = require("jsonwebtoken");
require("dotenv").config();

const Verify = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err) return res.status(400).json("Token is not valid");
            req.user = user;
            next();
        })
    }else{
        return res.status(400).json("You are not authenticated");
    }
}

module.exports = Verify;