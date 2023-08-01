
const jwt = require("jsonwebtoken")
const { UserModal } = require("../modal/userModal")
const { RouterAsyncErrorHandler } = require("../middleware/ErrorHandler/MiddlewareErrorHandlers")
const { internalServerError, credentialError } = require("../middleware/ErrorHandler/customError")


exports.registerUser = RouterAsyncErrorHandler(async (req, res, next) => {
    const { email, password, name } = req.body
    const role = req.body?.role || "USER"
    const user = await UserModal.create({ email, name, role, password })
    if (user) {
        console.log(user.id);
        const token = jwt.sign(
            {
                id: user.id,
            },

            process.env.userJWT,
            { expiresIn: '1d' }
        )
        return res.json({ token: "Bearer " + token })

    }
    else throw new internalServerError()
})




exports.loginUser = RouterAsyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await UserModal.findOne({ email }).select(["+password"])
    if (!user) throw new credentialError("email")

    if (!await user.comparePassword(password)) throw new credentialError("password")
    const token = jwt.sign(
        {
            id: user.id,
        },

        process.env.userJWT,
        { expiresIn: '1d' }
    )
    return res.json({ token: "Bearer " + token })
})




exports.logoutUser = RouterAsyncErrorHandler(async (req, res, next) => {
    return res.json({ success: true })
})


exports.deleteUser = RouterAsyncErrorHandler(async (req, res, next) => {

    return res.json({ success: true })
})