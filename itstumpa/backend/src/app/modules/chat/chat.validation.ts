import { z } from "zod";

const sendMessage = z.object({
  body: z.object({
    conversationId: z.string().cuid(),
    content: z.string().min(1).max(5000).optional(),
    fileData: z
      .object({
        fileUrl: z.string().url(),
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number().int().positive(),
      })
      .optional(),
  }).refine(
    (data) => data.content || data.fileData,
    { message: "Either content or fileData must be provided" }
  ),
});


const getOrCreateConversation = z.object({
  body: z.object({
    participantIds: z
      .array(z.string())
      .length(2, "Exactly 2 participant IDs are required"),
  }),
});

const getConversation = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

const deleteConversation = z.object({
  params: z.object({
    conversationId: z.string().cuid(),
  }),
});

export const ChatValidation = {
  sendMessage,
  getOrCreateConversation,
  getConversation,
  deleteConversation,
};