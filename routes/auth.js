const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//REGISTRER
router.post('/register', async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    });

    try{
        const user = await newUser.save();
        res.status(201).json(user);
    }catch(error){
        res.status(500);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(401).json('Wrong user or password');
        
        const bytes  = CryptoJs.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPass = bytes.toString(CryptoJs.enc.Utf8);

        if(originalPass !== req.body.password) return res.status(401).json('Wrong pass or username');

        const accesToken = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.SECRET_KEY, {expiresIn:'5d'});
        
        const { password, ...info } = user._doc;

        res.status(201).json({...info, accesToken});
        
        
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;