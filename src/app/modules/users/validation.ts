import Joi from "joi";
import { ROLE } from "./model";


export default {
    create: {
        body: {
            schema: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string()
                    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
                    .messages({
                        "string.pattern.base": `Password must contain uppercase, lowercase, digit and a special character`,
                        "string.empty": `Password is not allowed to be empty`
                    })
                    .required(),
                confirmPassword: Joi.string()
                    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
                    .valid(Joi.ref("password"))
                    .label('Confirm Password')
                    .messages({
                        "string.pattern.base": `Password must contain uppercase, lowercase, digit and a special character`,
                        "string.empty": `{{#label}} is not allowed to be empty`,
                        "any.only": `Confirm Password does not match password`,
                        "any.required": `Confirm password is required`
                    })
                    .required(),
                username: Joi.string()
                    .lowercase()
                    .regex(/^[a-zA-Z]+[a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/)
                    .messages({
                        "string.pattern.base": `Username is not allowed to have special characters`,
                    })
                    .min(3)
                    .trim(),
                role: Joi.string().valid(...Object.values(ROLE)).default(ROLE.USER)
            })
        }
    },

    login: {
        body: {
            schema: Joi.object({
                password: Joi.string()
                    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
                    .messages({
                        "string.pattern.base": `Password must contain uppercase, lowercase, digit and a special character`,
                        "string.empty": `Password is not allowed to be empty`
                    })
                    .required(),
                username: Joi.string()
                    .lowercase()
                    .regex(/^[a-zA-Z]+[a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/)
                    .messages({
                        "string.pattern.base": `Username is not allowed to have special characters`,
                    })
                    .min(3)
                    .trim()
            })
        }
    }
}