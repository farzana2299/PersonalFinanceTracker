const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        require: [true, "Email is required"],
    },
},
    { timestamps: true }
)
const user = mongoose.model("user", userSchema);