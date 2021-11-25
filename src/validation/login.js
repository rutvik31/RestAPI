const Joi = require('joi')

function loginValidation(body) {
    const loginSchema = Joi.object().keys({

        email: Joi.string()
            .email()
            .trim()
            .required(),

        password: Joi.string()
            .min(8)
            .max(30)
            .required()

    })
    return loginSchema.validate(body)
}
module.exports = loginValidation







