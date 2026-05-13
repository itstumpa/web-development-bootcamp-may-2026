import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import * as UserController from './users.controller';
import { createUserSchema, searchUsersSchema, updateUserSchema, userIdParamSchema } from './users.validation';

const router = Router();
router.use(authenticate);

router.get('/search', validateRequest(searchUsersSchema), UserController.searchUsers);
router.post('/', validateRequest(createUserSchema), UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', validateRequest(userIdParamSchema), UserController.getUserById);
router.patch('/:id', authorize('ADMIN'), validateRequest(updateUserSchema), UserController.updateUser);
router.delete('/:id', authorize('ADMIN'), UserController.deleteUser);

export default router;
