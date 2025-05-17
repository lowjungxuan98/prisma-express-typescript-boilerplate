import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { messageService } from '../services';

const createMessage = catchAsync(async (req, res) => {
  const { conversationId, userId, messageText } = req.body;
  const message = await messageService.createMessage(conversationId, userId, messageText);
  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['conversationId', 'userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const messages = await messageService.queryMessages(filter, options);
  res.send(messages);
});

const getMessage = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(Number(req.params.messageId));
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  res.send(message);
});

const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessageById(Number(req.params.messageId), req.body);
  res.send(message);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessageById(Number(req.params.messageId));
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage
}; 