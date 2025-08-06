const { user } = require("../models/collection")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userRegistration = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Required Fields Missing" });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
                status: false,
                statusCode: 403
            });
        }

        const hashedPw = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            username,
            email,
            password: hashedPw
        });

        return res.status(200).json({
            message: "User Registered Successfully",
            user: newUser,
            status: true,
            statusCode: 200,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
};

const userLogin = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next("Please Provide all fields")
    }

    const ur = await user.findOne({ email });

    if (ur) {

        const token = jwt.sign({ _id: ur._id }, "superkey123");
        res.status(200).json({
            message: "Login successfully",
            status: true,
            statusCode: 200,
            _id: ur._id,
            username: ur.username,
            token
        });

    }
    else {
        res.status(404).json({
            message: "No user Found",
            status: false,
            statusCode: 404
        });
    }

};


module.exports = { userRegistration,userLogin }