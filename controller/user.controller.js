const asyncWrapper = require("../middelware/asyncWrapper");

const User = require('../models/user.model');
const appError = require("../utils/appError");
const generateToken = require("../utils/generateToken");
const httpStatusText = require('../utils/httpStatusText')


const getUsers = asyncWrapper(
    async (req, res, next) => {
        const users = await User.find();
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { users } })
    }
)





const register = asyncWrapper(
    async (req, res, next) => {
        const { Name, email, password, role } = req.body
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            const error = appError.create('user already exist', 400, httpStatusText.ERROR);
            return next(error)
        }
        const newUser = new User({
            Name,
            email,
            password,
            role,
            avatar: req.file.fileName
        })

        await newUser.save();

        return res.status(201).json({ status: httpStatusText.SUCCESS, data: { newUser } })
    }
)







const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })
        if (!user) {
            const error = appError.create('user not found', 404, httpStatusText.ERROR);
            return next(error)
        }

        if (user.password != password) {
            const error = appError.create('password incorrect', 400, httpStatusText.ERROR);
            return next(error)
        }

       const token =  generateToken({email: user.email, id: user._id, role: user.role})

        return res.status(201).json({ status: httpStatusText.SUCCESS, data: {token} })
    }
)




module.exports = { getUsers, register, login }