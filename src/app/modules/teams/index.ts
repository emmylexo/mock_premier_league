import { Router } from "express";
import { joiValidator } from "iyasunday";
import validation from "./validation";
import * as controller from './controller';
import { AdminGuard, guard } from "../../utils/middleware";

const route = Router();

route.post(
    "/team",
    guard,
    AdminGuard,
    joiValidator(validation.create),
    controller.create
);

route.get(
    "/teams",
    guard,
    // AdminGuard,
    joiValidator(validation.list),
    controller.list
);

route.get(
    "/team/:teamId",
    guard,
    AdminGuard,
    joiValidator(validation.view),
    controller.view
);

route.patch(
    "/team/:teamId",
    guard,
    AdminGuard,
    joiValidator(validation.update),
    controller.update
);

route.delete(
    "/team/:teamId",
    guard,
    AdminGuard,
    joiValidator(validation.remove),
    controller.remove
);

route.get(
    "/search",
    joiValidator(validation.search),
    controller.search
);

export default route;