const Joi = require('joi');

function registerValidation(data) {
    const registerSchema = Joi.object().keys({
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),

        email: Joi.string()
            .email()
            .trim()
            .required(),

        password: Joi.string()
            .min(8)
            .max(30)
            .required()

    })
    return registerSchema.validate(data)
}
module.exports = registerValidation