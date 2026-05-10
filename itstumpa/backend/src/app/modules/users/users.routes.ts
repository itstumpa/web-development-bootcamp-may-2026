import { Router } from "express";
import * as UserController from "./users.controller";
import { validate } from "../../middlewares/validate";
import { createUserSchema, searchUsersSchema, updateUserSchema, userIdParamSchema } from "./users.validation";
import { authorize } from "../../middlewares/authorize";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();
router.use(authenticate);

router.get("/search", validate(searchUsersSchema), UserController.searchUsers);
router.post("/", validate(createUserSchema), UserController.createUser);
router.get("/", authorize("ADMIN"),UserController.getAllUsers);
router.get("/:id", validate(userIdParamSchema), UserController.getUserById);
router.patch("/:id", authorize("ADMIN"), validate(updateUserSchema), UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;