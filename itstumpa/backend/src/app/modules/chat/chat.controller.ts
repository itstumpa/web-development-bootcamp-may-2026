import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ChatService } from "./chat.service";
import { getIO } from "../../../lib/socket";
import ApiError from "../../../utils/apiErrors";

const getConversation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

const options = {
  page: Number(req.query.page) || 1,
  limit: Number(req.query.limit) || 20,
  sortOrder: (req.query.sortOrder as string) || "asc",
};

  const conversation = await ChatService.getConversation(
    id as string,
    req.user!.id,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Conversation fetched successfully",
    data: conversation,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { conversationId, content, fileData } = req.body;

  const newMessage = await ChatService.createMessage(
    conversationId,
    req.user!.id,
    content,
    fileData,
  );

  // Emit to other participants
  const io = getIO();
io.to(conversationId).emit("new_message", newMessage);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Message sent successfully",
    data: newMessage,
  });
});

const getOrCreateConversation = catchAsync(
  async (req: Request, res: Response) => {

    const { otherUserId } = req.body;
    if (req.user!.id === otherUserId) {
  throw new ApiError(400, "You cannot start a conversation with yourself");
}

    const conversation = await ChatService.getOrCreateConversation([
      req.user!.id,
      otherUserId,
    ]);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Conversation ready",
      data: conversation,
    });
  },
);

const deleteConversation = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  const result = await ChatService.deleteConversation(
    conversationId as string,
    req.user!.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

const getUserConversations = catchAsync(
  async (req: Request, res: Response) => {
    const conversations = await ChatService.getUserConversations(
      req.user!.id,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Conversations fetched successfully",
      data: conversations,
    });
  },
);

export const ChatController = {
  getConversation,
  sendMessage,
  getOrCreateConversation,
  deleteConversation,
  getUserConversations,
};