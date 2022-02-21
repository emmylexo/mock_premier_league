import Joi from "joi";
import { FIXTURES_STATUS } from "../../utils/constants";

export default {
    create: {
        body: {
            schema: Joi.object({
                homeTeamId: Joi.string().required(),
                awayTeamId: Joi.string().required(),
                matchDate: Joi.string().required(),
                status: Joi.string().valid(...Object.values(FIXTURES_STATUS)).default(FIXTURES_STATUS.PENDING)
            })
        }
    },

    list: {
        query: {
            schema: Joi.object({
                status: Joi.string().valid(...Object.values(FIXTURES_STATUS)),
                limit: Joi.number().integer().positive().default(20),
                page: Joi.number().integer().positive().default(1)
            })

        }
    },

    view: {
        params: {
            schema: Joi.object({
                fixtureId: Joi.string().required(),
            })
        }
    },

    update: {
        params: {
            schema: Joi.object({
                fixtureId: Joi.string().required(),
            })
        },

        body: {
            schema: Joi.object({
                homeTeamId: Joi.string(),
                awayTeamId: Joi.string(),
                matchDate: Joi.string(),
                status: Joi.string().valid(...Object.values(FIXTURES_STATUS))
            })
        }
    },

    remove: {
        params: {
            schema: Joi.object({
                fixtureId: Joi.string().required(),
            })
        }
    }
}