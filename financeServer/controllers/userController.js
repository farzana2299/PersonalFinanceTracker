const { user, transaction } = require("../models/collection")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

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

// AddTransaction 
const addTransaction = async (req, res) => {
    const { uid } = req.params;
    const { amount, type, income, expense, date, description } = req.body;

    if (!amount || !type || !date) {
        return res.status(400).json({
            status: false,
            message: "All fields are required."
        });
    }

    try {
        const userData = await user.findById(uid);
        if (!userData) {
            return res.status(404).json({
                status: false,
                message: "Transaction not found"
            });
        }

        const transactionData = new transaction({
            amount,
            type,
            income,
            expense,
            date,
            description,
            uid: userData._id
        });

        const savedTransaction = await transactionData.save();

        if (!savedTransaction) {
            throw new Error("Failed to Create ransaction.");
        }

        return res.status(201).json({
            status: true,
            message: "Transaction created successfully",
            transaction: savedTransaction
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error while Adding Job",
            error: error.message
        });
    }
};

const allTransactionByUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const userObjectId = new mongoose.Types.ObjectId(uid);

        const query = {
            uid: userObjectId,
            $or: [
                { income: { $regex: search, $options: "i" } },
                { expense: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } }
            ]
        };

        const [transactions, total] = await Promise.all([
            transaction.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            transaction.countDocuments(query)
        ]);

        res.status(200).json({
            message: transactions,
            status: true,
            statusCode: 200,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while loading transactions",
            status: false,
            statusCode: 500
        });
    }
};

const editTransaction = async (req, res) => {
    const { id } = req.params
    const { amount, type, income, expense, date, description } = req.body;
    try {
        const data = await transaction.findById(id)

        if (data) {
            data.amount = amount,
                data.type = type,
                data.income = income,
                data.expense = expense,
                data.date = date,
                data.description = description,
                await data.save()

            res.status(200).json({
                message: "Data Updated",
                status: true,
                statusCode: 200
            })
        }
        else {
            res.status(400).json("Transaction not found")
        }
    }

    catch (err) {
        res.status(401).json("Transaction Edit is Not Working")
    }
}

const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transactionResult = await transaction.deleteOne({ _id: id });

        if (transactionResult.deletedCount === 0) {
            return res.status(404).json({
                message: "Transaction post not found",
                status: false,
                statusCode: 404,
            });
        }

        return res.status(200).json({
            message: "Transaction Deleted Successfully",
            status: true,
            statusCode: 200,
            deleted: {
                transaction: transactionResult.deletedCount,
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while deleting the job",
            status: false,
            statusCode: 500,
        });
    }
};


const getTotalIncome = async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await transaction.aggregate([
            {
                $match: {
                    type: "Income",
                    uid: new mongoose.Types.ObjectId(uid)
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$amount" }
                }
            }
        ]);
        const totalIncome = result[0]?.totalIncome || 0;

        res.status(200).json({
            data: totalIncome,
            status: true,
            statusCode: 200
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            status: false,

        });
    }
};

const getTotalExpense = async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await transaction.aggregate([
            {
                $match: {
                    type: "Expense",
                    uid: new mongoose.Types.ObjectId(uid)
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: "$amount" }
                }
            }
        ]);
        const totalExpense = result[0]?.totalExpense || 0;

        res.status(200).json({
            data: totalExpense,
            status: true,
            statusCode: 200
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            status: false,
            
        });
    }
};

const getCurrentBalance = async (req, res) => {
    try {
        const { uid } = req.params;
        const userId = new mongoose.Types.ObjectId(uid);

        const result = await transaction.aggregate([
            {
                $match: { uid: userId }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        result.forEach(item => {
            if (item._id === "Income") totalIncome = item.total;
            if (item._id === "Expense") totalExpense = item.total;
        });

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            message: balance,
            status: true,
            statusCode: 200
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error",
            status: false
        });
    }
};

const getAverageMonthlyIncome = async (req, res) => {
  try {
    const { uid } = req.params;

    const result = await transaction.aggregate([
      {
        $match: {
          uid: uid,
          type: "Income",
        },
      },
      {
        $addFields: {
          yearMonth: {
            $dateToString: { format: "%Y-%m", date: "$date" }
          }
        }
      },
      {
        $group: {
          _id: "$yearMonth",
          monthlyTotal: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: null,
          averageIncome: { $avg: "$monthlyTotal" }
        }
      }
    ]);

    const avgIncome = result[0]?.averageIncome || 0;

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: avgIncome,
    });
  } catch (error) {
    console.error("Error calculating average monthly income:", error);
    res.status(500).json({
      status: false,
      message: "Server error while calculating average monthly income",
      statusCode:500
    });
  }
};

const getAverageMonthlyExpense = async (req, res) => {
  try {
    const { uid } = req.params;

    const result = await transaction.aggregate([
      {
        $match: {
          uid: uid,
          type: "Expense",
        },
      },
      {
        $addFields: {
          yearMonth: {
            $dateToString: { format: "%Y-%m", date: "$date" }
          }
        }
      },
      {
        $group: {
          _id: "$yearMonth",
          monthlyTotal: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: null,
          averageExpense: { $avg: "$monthlyTotal" }
        }
      }
    ]);

    const avgExpense = result[0]?.averageExpense || 0;

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: avgExpense,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something Went Wrong",
      statusCode:500
    });
  }
};

module.exports = { userRegistration, userLogin, addTransaction, allTransactionByUser, deleteTransaction, editTransaction, 
    getTotalIncome,getTotalExpense,getCurrentBalance,getAverageMonthlyIncome,getAverageMonthlyExpense }