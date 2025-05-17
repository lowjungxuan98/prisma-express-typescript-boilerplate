import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { conversationService, messageService } from '../services';

const createConversation = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const conversation = await conversationService.createConversation(userId);
  res.status(httpStatus.CREATED).send(conversation);
});

const getConversations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const conversations = await conversationService.queryConversations(filter, options);
  res.send(conversations);
});

const getConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.getConversationById(Number(req.params.conversationId));
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  res.send(conversation);
});

const getConversationMessages = catchAsync(async (req, res) => {
  const conversation = await conversationService.getConversationById(Number(req.params.conversationId));
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  
  const messages = await messageService.getMessagesByConversationId(Number(req.params.conversationId));
  res.send(messages);
});

const updateConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.updateConversationById(Number(req.params.conversationId), req.body);
  res.send(conversation);
});

const deleteConversation = catchAsync(async (req, res) => {
  await conversationService.deleteConversationById(Number(req.params.conversationId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createConversation,
  getConversations,
  getConversation,
  getConversationMessages,
  updateConversation,
  deleteConversation
}; 