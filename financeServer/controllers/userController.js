const { user } = require("../models/collection")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userRegistration = async (req, res, next) => {
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

        const hashedPw = await bcrypt.hash(psw, 10);

        const newUser = await user.create({
            username,
            email,
            psw: hashedPw
        });

        return res.status(200).json({
            message: "User Registered Successfully",
            user: newUser,
            status: true,
            statusCode: 200,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { userRegistration }