const { body, validationResult } = require('express-validator')

async function validateResult(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

const registerUserValidationResult = [
    body("username")
        .isString()
        .withMessage("username must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("username must be between 3 and 20 character"),

    body("email")
        .optional({ values: "falsy" })
        .isEmail()
        .trim()
        .withMessage("invalid email address"),

    body("phone")
        .optional({ values: "falsy" })
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("pls enter a valid 10 digit Indian mobile number"),

    body().custom((value, { req }) => {
            const hasEmail = req.body.email && req.body.email.trim() !== "";
            const hasPhone = req.body.phone && req.body.phone.trim() !== "";

            if (!hasEmail && !hasPhone) {
                throw new Error("pls provide either an email or a phone ")
            }
            return true;
        }),

    body("password")
        .isString()
        .withMessage("password should be a string")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 4
        })
        .withMessage("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 4 special symbols"),

    body("bio")
        .isLength({ max: 150 })
        .withMessage("bio should be max 150 character"),

    validateResult
]

const updateuserValidationResult = [

    body("username")
        .isString()
        .withMessage("username must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("username must be between 3 and 20 character"),

    body("bio")
        .isLength({ max: 150 })
        .withMessage("bio should be max 150 character"),

    validateResult
]



module.exports = { registerUserValidationResult, updateuserValidationResult }