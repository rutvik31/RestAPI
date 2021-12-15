require('dotenv').config()

const User = require('../model/users')
const Token = require('../model/token')
const bcrypt = require('bcrypt')
const crypto = require("crypto");
const saltRounds = 10;
const sendEmail = require('../utility/sendEmails');

//Reset Password Link
exports.resetPasswordLink = async function (req, res) {

    try {

        //Check if user is in the database
        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(400).send("user with given email doesn't exist")

        let token = await Token.findOne({ userId: user._id })
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save()
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`
        await sendEmail(user.email, "Password reset", `${link}`)
        // console.log(link)
        res.send("password reset link sent to your email account")
    } catch (error) {
        res.send("An error occured")

    }
}

//Set a new Password
exports.resetPassword = async function (req, res) {

    try {

        //Check if user is in the database
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired")

        //Validate Token
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired")

        //Save new password and delete the token after that 
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(req.body.password, salt);

        user.password = hash;
        user.save()
        await token.deleteOne()
        res.send("password reset sucessfully.")
    } catch (error) {
        res.send("An error occured")

    }
}
