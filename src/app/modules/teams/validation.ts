import Joi from "joi";
import { FIXTURES_STATUS } from "../../utils/constants";


export default {
    create: {
        body: {
            schema: Joi.object({
                name: Joi.string()
                    .lowercase()
                    .regex(/^[a-z]{1,}[\s]{0,1}[-']{0,1}[a-z]+$/i)
                    .messages({
                        "string.pattern.base": `Team name is not allowed to have special characters and should be alphabets`,
                    })
                    .min(3)
                    .trim()
            })
        }
    },

    list: {
        query: {
            schema: Joi.object({
                limit: Joi.number().integer().positive().default(20),
                page: Joi.number().integer().positive().default(1)
            })

        }
    },

    view: {
        params: {
            schema: Joi.object({
                teamId: Joi.string().required()
            })

        }
    },

    remove: {
        params: {
            schema: Joi.object({
                teamId: Joi.string().required()
            })

        }
    },

    update: {
        body: {
            schema: Joi.object({
                name: Joi.string()
                    .lowercase()
                    .regex(/^[a-z]{1,}[\s]{0,1}[-']{0,1}[a-z]+$/i)
                    .messages({
                        "string.pattern.base": `Team name is not allowed to have special characters and should be alphabets`,
                    })
                    .min(3)
                    .trim()
            })
        },

        params: {
            schema: Joi.object({
                teamId: Joi.string().required()
            })

        }
    },

    search: {
        query: {
            schema: Joi.object({
                status: Joi.string().valid(...Object.values(FIXTURES_STATUS)),
                limit: Joi.number().integer().positive().default(20),
                page: Joi.number().integer().positive().default(1),
                phrase: Joi.string(),
            })

        }
    },
}