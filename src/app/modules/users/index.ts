import { Router } from "express";
import { joiValidator } from "iyasunday";
import validation from "./validation";
import * as controller from './controller';

const route = Router();

route.post(
    "/auth/create-user",
    joiValidator(validation.create),
    controller.create
);

route.post(
    "/auth/login",
    joiValidator(validation.login),
    controller.login
)

export default route;