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

const transactionSchema = new mongoose.Schema(
    {
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    type: {
        type: String,
        required: [true, 'Type is required']
    },
    income: {
        type: String,
    },
    expense: {
        type: String,
    },
    date: {
        type: String,
        require: [true, "Date is required"],
    },
    description: {
        type: String,
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    { timestamps: true }
)
const transaction = mongoose.model("transaction", transactionSchema);

module.exports = { user, transaction }