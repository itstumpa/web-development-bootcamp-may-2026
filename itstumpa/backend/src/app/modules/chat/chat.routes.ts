import { Router } from 'express';
import { ChatController } from './chat.controller';
import { ChatValidation } from './chat.validation';
// import auth from '../../middlewares/auth'; // adjust path
import { validateRequest } from '../../middlewares/validateRequest';
import { authorize } from '../../middlewares/authorize';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();
router.use(authenticate);

// Get user's conversation list
router.get('/', ChatController.getUserConversations);

// Get or create conversation with another user
router.post( '/', validateRequest(ChatValidation.getOrCreateConversation), ChatController.getOrCreateConversation);

// Get single conversation with messages
router.get('/:id', validateRequest(ChatValidation.getConversation), ChatController.getConversation);

// Send message
router.post('/messages', validateRequest(ChatValidation.sendMessage), ChatController.sendMessage);

// Delete conversation
router.delete('/:conversationId', validateRequest(ChatValidation.deleteConversation), ChatController.deleteConversation);

export const ChatRoutes = router;
