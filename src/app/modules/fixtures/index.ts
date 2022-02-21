import { Router } from "express";
import { joiValidator } from "iyasunday";
import validation from "./validation";
import * as controller from './controller';
import { AdminGuard, guard } from "../../utils/middleware";

const route = Router();

route.post(
    "/fixture",
    guard,
    AdminGuard,
    joiValidator(validation.create),
    controller.create
);

route.get(
    "/fixtures",
    guard,
    AdminGuard,
    joiValidator(validation.list),
    controller.list
);

route.get(
    "/fixture/:fixtureId",
    guard,
    joiValidator(validation.view),
    controller.view
);

route.patch(
    "/fixture/:fixtureId",
    guard,
    AdminGuard,
    joiValidator(validation.update),
    controller.update
);

route.delete(
    "/fixture/:fixtureId",
    guard,
    AdminGuard,
    joiValidator(validation.remove),
    controller.remove
);

export default route;