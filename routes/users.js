const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const verify = require("../verifyToken");

//UPDATE
router.put("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        if(req.body.password){
            req.body.password = CryptoJs.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body
            },
            {
                new: true
            }
            );
            res.status(200).json(updatedUser);
        }catch(err){
            res.status(400).json(err)
        }
    }else{
        res.status(400).json("You can only update your account")
    }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
        }catch(err){
            res.status(400).json(err)
        }
    }else{
        res.status(400).json("You can only delete your account")
    }
});

//GET SPECIFIC USER
router.get("/find/:id", verify, async (req, res) => {
        try{
            const user = await User.findById(req.params.id);
            const { password, ...info } = user._doc; 
            res.status(200).json(info);
        }catch(err){
            res.status(400).json(err)
        }
});

//GET ALL USERS
router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if(req.user.isAdmin) {
        try{
            const users = query ? await User.find().limit(10) : await User.find();
            res.status(200).json(user);
        }catch(err){
            res.status(400).json(err)
        }
    }else{
        res.status(400).json("You can only update your account")
    }
});

module.exports = router;